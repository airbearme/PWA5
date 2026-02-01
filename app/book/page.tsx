"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/components/auth-provider";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Navigation, DollarSign, Clock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Spot } from "@/components/map-view";

export default function BookRidePage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [pickupSpot, setPickupSpot] = useState<Spot | null>(null);
  const [destinationSpot, setDestinationSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadSpots = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("spots")
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (error) throw error;
        setSpots(data || []);

        // Check for pickup spot from URL
        const pickupId = searchParams.get("pickup");
        if (pickupId && data) {
          const spot = data.find((s) => s.id === pickupId);
          if (spot) setPickupSpot(spot);
        }
      } catch (error) {
        console.error("Error loading spots:", error);
        toast({
          title: "Error",
          description: "Failed to load locations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, [searchParams, toast]);

  const calculateDistance = (spot1: Spot, spot2: Spot): number => {
    const R = 6371; // Earth's radius in km
    const lat1 = spot1.latitude * (Math.PI / 180);
    const lat2 = spot2.latitude * (Math.PI / 180);
    const deltaLat = (spot2.latitude - spot1.latitude) * (Math.PI / 180);
    const deltaLon = (spot2.longitude - spot1.longitude) * (Math.PI / 180);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const estimateFare = (distance: number): number => {
    // Flat rate $4.00 for all rides
    return 4.0;
  };

  const handleBookRide = async () => {
    if (!pickupSpot || !destinationSpot || !user) {
      toast({
        title: "Missing Information",
        description: "Please select both pickup and destination locations",
        variant: "destructive",
      });
      return;
    }

    setBooking(true);

    try {
      const supabase = getSupabaseClient();
      const distance = calculateDistance(pickupSpot, destinationSpot);
      const fare = estimateFare(distance);

      // Find available AirBear
      const { data: availableAirbears } = await supabase
        .from("airbears")
        .select("id")
        .eq("is_available", true)
        .eq("is_charging", false)
        .limit(1);

      const airbearId = availableAirbears?.[0]?.id || null;

      // Create ride booking via API
      const response = await fetch("/api/rides/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup_spot_id: pickupSpot.id,
          dropoff_spot_id: destinationSpot.id,
          fare,
          distance,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create ride");
      }

      const { ride } = await response.json();

      toast({
        title: "Ride Booked!",
        description: `Your ride from ${pickupSpot.name} to ${destinationSpot.name} has been booked.`,
      });

      // Redirect to checkout
      router.push(`/checkout?rideId=${ride.id}&amount=${fare}`);
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBooking(false);
    }
  };

  const distance = pickupSpot && destinationSpot
    ? calculateDistance(pickupSpot, destinationSpot)
    : 0;
  const fare = estimateFare(distance);

  if (authLoading || loading) {
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
            Loading booking...
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
            Book Your AirBear Ride
          </h1>
          <p className="text-lg text-muted-foreground">
            Select your pickup and destination locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Location */}
          <Card className="p-6 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                Pickup Location
              </CardTitle>
              <CardDescription>Where should we pick you up?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {pickupSpot ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                    {pickupSpot.name}
                  </p>
                  {pickupSpot.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {pickupSpot.description}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setPickupSpot(null)}
                    disabled={booking}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className={`space-y-2 max-h-60 overflow-y-auto ${booking ? "opacity-50 cursor-not-allowed" : ""}`}>
                  {spots.map((spot) => (
                    <button
                      key={spot.id}
                      type="button"
                      className="w-full text-left p-3 rounded-lg border hover:bg-muted focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                      onClick={() => setPickupSpot(spot)}
                      disabled={booking}
                      aria-label={`Select ${spot.name} as pickup location`}
                    >
                      <p className="font-medium">{spot.name}</p>
                      {spot.description && (
                        <p className="text-sm text-muted-foreground">
                          {spot.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Destination */}
          <Card className="p-6 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-amber-600" aria-hidden="true" />
                Destination
              </CardTitle>
              <CardDescription>Where are you going?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {destinationSpot ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    {destinationSpot.name}
                  </p>
                  {destinationSpot.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {destinationSpot.description}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setDestinationSpot(null)}
                    disabled={booking}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className={`space-y-2 max-h-60 overflow-y-auto ${booking ? "opacity-50 cursor-not-allowed" : ""}`}>
                  {spots
                    .filter((s) => s.id !== pickupSpot?.id)
                    .map((spot) => (
                      <button
                        key={spot.id}
                        type="button"
                        className="w-full text-left p-3 rounded-lg border hover:bg-muted focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors"
                        onClick={() => setDestinationSpot(spot)}
                        disabled={booking}
                        aria-label={`Select ${spot.name} as destination`}
                      >
                        <p className="font-medium">{spot.name}</p>
                        {spot.description && (
                          <p className="text-sm text-muted-foreground">
                            {spot.description}
                          </p>
                        )}
                      </button>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ride Summary */}
        {pickupSpot && destinationSpot && (
          <Card className="mt-6 p-6 hover-lift">
            <CardHeader>
              <CardTitle>Ride Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-semibold">{pickupSpot.name}</p>
                    <p className="text-sm text-muted-foreground">Pickup</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-semibold">{destinationSpot.name}</p>
                    <p className="text-sm text-muted-foreground">Destination</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-semibold">{distance.toFixed(1)} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Time</p>
                    <p className="font-semibold">
                      {Math.round(distance * 3)} min
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 rounded-lg border-2 border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Fare</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${fare.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBookRide}
                disabled={booking}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-12 text-lg"
              >
                {booking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Ride & Continue to Payment"
              )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Back to Map */}
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/map">Back to Map</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

