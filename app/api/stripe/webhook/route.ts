import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const supabase = await getSupabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        await supabase.from("orders").insert({
          user_id: userId,
          total_amount: session.amount_total! / 100,
          status: "completed",
          stripe_payment_id: session.payment_intent as string,
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
