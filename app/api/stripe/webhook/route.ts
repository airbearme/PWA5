import Stripe from "stripe";
import { NextResponse } from "next/server";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({}, { status: 400 });

  const body = await req.text();
  try {
    stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({}, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
