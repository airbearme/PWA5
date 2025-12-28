"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAuthContext } from "@/components/auth-provider";
import { MapPin, Zap } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";
import errorLogger from "@/lib/error-logger";

interface OneClickBookingProps {
  pickupSpotId: string;
  destinationSpotId: string;
  fare: number;
  distance: number;
  onSuccess?: () => void;
}

export function OneClickBooking({
  pickupSpotId,
  destinationSpotId,
  fare,
  distance,
  onSuccess,
}: OneClickBookingProps) {
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const handleOneClickBook = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a ride",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const supabase = getSupabaseClient();

      // Find available AirBear
      const { data: availableAirbears } = await supabase
        .from("airbears")
        .select("*")
        .eq("is_available", true)
        .eq("is_charging", false)
        .limit(1);

      if (!availableAirbears || availableAirbears.length === 0) {
        toast({
          title: "No AirBears Available",
          description: "All AirBears are currently in use. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      const airbear = availableAirbears[0];

      // Create ride booking
      const { error: rideError } = await supabase
        .from("rides")
        .insert({
          user_id: user.id,
          pickup_spot_id: pickupSpotId,
          dropoff_spot_id: destinationSpotId,
          airbear_id: airbear.id,
          fare,
          distance,
          status: "pending",
        })
        .select()
        .single();

      if (rideError) throw rideError;

      // Show payment options
      setShowPayment(true);

      toast({
        title: "Ride Booked!",
        description: "Please complete payment to confirm your ride.",
      });
    } catch (error: any) {
      errorLogger.logError(error, {
        component: "OneClickBooking",
        action: "handleOneClickBook",
      });

      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    toast({
      title: "Payment Successful!",
      description: "Your ride is confirmed. An AirBear will arrive soon!",
    });
    setShowPayment(false);
    onSuccess?.();
  };

  if (showPayment) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>Total: ${fare.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          <CheckoutButton
            items={[
              {
                name: "AirBear Ride",
                price: fare,
                quantity: 1,
              },
            ]}
            onSuccess={handlePaymentSuccess}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={handleOneClickBook}
      disabled={loading}
      size="lg"
      className="w-full eco-gradient text-white hover-lift ripple-effect animate-neon-glow shadow-xl"
    >
      {loading ? (
        <>
          <Zap className="mr-2 h-5 w-5 animate-spin" />
          Booking...
        </>
      ) : (
        <>
          <MapPin className="mr-2 h-5 w-5" />
          Book Now - ${fare.toFixed(2)}
        </>
      )}
    </Button>
  );
}

