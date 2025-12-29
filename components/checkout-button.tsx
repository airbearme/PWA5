"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getStripe } from "@/lib/stripe/client"

export function CheckoutButton({ items }: { items: any[] }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })

    const { sessionId } = await res.json()
    const stripe = await getStripe()
    await stripe?.redirectToCheckout({ sessionId })

    setLoading(false)
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full">
      {loading ? "Processing..." : "Checkout with Apple Pay / Google Pay"}
    </Button>
  )
}
