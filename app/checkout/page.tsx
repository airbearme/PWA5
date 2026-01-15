"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/components/auth-provider";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CreditCard from "lucide-react/dist/esm/icons/credit-card";
import Smartphone from "lucide-react/dist/esm/icons/smartphone";
import QrCode from "lucide-react/dist/esm/icons/qr-code";
import CheckCircle from "lucide-react/dist/esm/icons/check-circle";
import Apple from "lucide-react/dist/esm/icons/apple";
import Wallet from "lucide-react/dist/esm/icons/wallet";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface CheckoutFormProps {
  clientSecret: string;
  rideId: string;
  amount: number;
  onSuccess: () => void;
}

function CheckoutForm({ clientSecret, rideId, amount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Update ride status
        const supabase = getSupabaseClient();
        await supabase
          .from("rides")
          .update({ status: "accepted" })
          .eq("id", rideId);

        toast({
          title: "Payment Successful!",
          description: "Your ride has been confirmed.",
        });

        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Payment processing failed",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-12 text-lg"
      >
        {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rideId, setRideId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [rideDetails, setRideDetails] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const setupPayment = async () => {
      const rideIdParam = searchParams.get("rideId");
      const amountParam = searchParams.get("amount");

      if (!rideIdParam || !amountParam || !user) {
        toast({
          title: "Invalid Request",
          description: "Missing ride or payment information",
          variant: "destructive",
        });
        router.push("/map");
        return;
      }

      setRideId(rideIdParam);
      setAmount(parseFloat(amountParam));

      try {
        // Load ride details
        const supabase = getSupabaseClient();
        const { data: ride } = await supabase
          .from("rides")
          .select("*, pickup_spot:spots!pickup_spot_id(*), dropoff_spot:spots!dropoff_spot_id(*)")
          .eq("id", rideIdParam)
          .single();

        setRideDetails(ride);

        // Create payment intent
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(amountParam),
            currency: "usd",
            metadata: {
              rideId: rideIdParam,
              userId: user.id,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { clientSecret: secret } = await response.json();
        setClientSecret(secret);
      } catch (error: any) {
        console.error("Payment setup error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to setup payment",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    setupPayment();
  }, [searchParams, user, router, toast]);

  if (authLoading || loading || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          <p className="text-xl text-muted-foreground animate-pulse">
            Setting up payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 dark:from-emerald-950 dark:via-lime-950 dark:to-amber-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent animate-pulse-glow">
            Complete Your Payment
          </h1>
          <p className="text-lg text-muted-foreground">
            Secure payment powered by Stripe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card className="p-6 hover-lift">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "night",
                      variables: {
                        colorPrimary: "#10b981",
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    clientSecret={clientSecret}
                    rideId={rideId}
                    amount={amount}
                    onSuccess={() => router.push("/dashboard")}
                  />
                </Elements>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 hover-lift sticky top-4">
              <CardHeader>
                <CardTitle>Ride Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rideDetails && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">
                          {rideDetails.pickup_spot?.name || "Pickup"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span className="font-medium">
                          {rideDetails.dropoff_spot?.name || "Destination"}
                        </span>
                      </div>
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      {rideDetails.distance && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Distance</span>
                          <span>{rideDetails.distance.toFixed(1)} km</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fare</span>
                        <span className="font-semibold">
                          ${amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-emerald-600">
                          ${amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/book">Back to Booking</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

