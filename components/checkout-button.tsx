"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getStripe } from "@/lib/stripe/client"
import { useToast } from "@/hooks/use-toast"
import CreditCard from "lucide-react/dist/esm/icons/credit-card";
import QrCode from "lucide-react/dist/esm/icons/qr-code";
import Apple from "lucide-react/dist/esm/icons/apple";
import Wallet from "lucide-react/dist/esm/icons/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CheckoutButtonProps {
  items: Array<{ name: string; price: number; quantity: number }>
  onSuccess?: () => void
}

export function CheckoutButton({ items, onSuccess }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cash">("stripe")
  const [walletLoading, setWalletLoading] = useState({
    apple: false,
    google: false,
  })
  const { toast } = useToast()

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleStripeCheckout = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      if (!res.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { sessionId } = await res.json()
      const stripe = await getStripe()

      if (!stripe) {
        throw new Error("Stripe not initialized")
      }

      await stripe.redirectToCheckout({ sessionId })
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApplePay = async () => {
    try {
      setWalletLoading((prev) => ({ ...prev, apple: true }))

      const stripe = await getStripe()
      if (!stripe) {
        throw new Error("Stripe not initialized")
      }

      // Create payment request
      const paymentRequest = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "AirBear Payment",
          amount: Math.round(total * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      const canMakePayment = await paymentRequest.canMakePayment()

      if (!canMakePayment?.applePay) {
        toast({
          title: "Apple Pay Unavailable",
          description: "Apple Pay is not available on this device",
          variant: "destructive",
        })
        return
      }

      // Create payment intent
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "usd",
          paymentMethod: "apple_pay",
        }),
      })

      const { clientSecret } = await res.json()

      paymentRequest.on("paymentmethod", async (ev) => {
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: ev.paymentMethod.id,
        })

        if (error) {
          ev.complete("fail")
          toast({
            title: "Payment Failed",
            description: error.message,
            variant: "destructive",
          })
        } else {
          ev.complete("success")
          toast({
            title: "Payment Successful",
            description: "Thank you for your purchase!",
          })
          onSuccess?.()
        }
      })

      paymentRequest.show()
    } catch (error: any) {
      toast({
        title: "Apple Pay Error",
        description: error.message || "Failed to process Apple Pay",
        variant: "destructive",
      })
    } finally {
      setWalletLoading((prev) => ({ ...prev, apple: false }))
    }
  }

  const handleGooglePay = async () => {
    try {
      setWalletLoading((prev) => ({ ...prev, google: true }))

      const stripe = await getStripe()
      if (!stripe) {
        throw new Error("Stripe not initialized")
      }

      // Create payment request
      const paymentRequest = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "AirBear Payment",
          amount: Math.round(total * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      const canMakePayment = await paymentRequest.canMakePayment()

      if (!canMakePayment?.googlePay) {
        toast({
          title: "Google Pay Unavailable",
          description: "Google Pay is not available on this device",
          variant: "destructive",
        })
        return
      }

      // Create payment intent
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "usd",
          paymentMethod: "google_pay",
        }),
      })

      const { clientSecret } = await res.json()

      paymentRequest.on("paymentmethod", async (ev) => {
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: ev.paymentMethod.id,
        })

        if (error) {
          ev.complete("fail")
          toast({
            title: "Payment Failed",
            description: error.message,
            variant: "destructive",
          })
        } else {
          ev.complete("success")
          toast({
            title: "Payment Successful",
            description: "Thank you for your purchase!",
          })
          onSuccess?.()
        }
      })

      paymentRequest.show()
    } catch (error: any) {
      toast({
        title: "Google Pay Error",
        description: error.message || "Failed to process Google Pay",
        variant: "destructive",
      })
    } finally {
      setWalletLoading((prev) => ({ ...prev, google: false }))
    }
  }

  const handleCashPayment = () => {
    toast({
      title: "Cash Payment",
      description: "Please pay with cash when you receive your order. A QR code will be provided for verification.",
    })
    onSuccess?.()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Options</CardTitle>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "stripe" | "cash")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="stripe">
              <CreditCard className="mr-2 h-4 w-4" />
              Card/Digital
            </TabsTrigger>
            <TabsTrigger value="cash">
              <QrCode className="mr-2 h-4 w-4" />
              Cash
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-16"
                onClick={handleApplePay}
                disabled={walletLoading.apple || loading}
              >
                <div className="text-center">
                  <Apple className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-xs">Apple Pay</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-16"
                onClick={handleGooglePay}
                disabled={walletLoading.google || loading}
              >
                <div className="text-center">
                  <Wallet className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-xs">Google Pay</span>
                </div>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              onClick={handleStripeCheckout}
              disabled={loading}
              className="w-full"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {loading ? "Processing..." : "Pay with Credit Card"}
            </Button>
          </TabsContent>

          <TabsContent value="cash" className="space-y-4">
            <div className="text-center p-6 border rounded-lg bg-muted/50">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Pay with cash when you receive your order. A QR code will be provided for order verification.
              </p>
              <Button onClick={handleCashPayment} variant="outline" className="w-full">
                Continue with Cash Payment
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

