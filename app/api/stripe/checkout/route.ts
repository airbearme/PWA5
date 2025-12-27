import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items } = await req.json()

    const session = await stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/products`,
      metadata: { userId: user.id },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch {
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}