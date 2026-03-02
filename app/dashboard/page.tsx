"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/auth-provider";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import Award from "lucide-react/dist/esm/icons/award";
import Navigation from "lucide-react/dist/esm/icons/navigation";
import Clock from "lucide-react/dist/esm/icons/clock";
import CheckCircle from "lucide-react/dist/esm/icons/check-circle";
import Link from "next/link";

interface Ride {
  id: string;
  pickup_spot_id: string;
  dropoff_spot_id: string;
  status: string;
  fare: number;
  distance: number;
  requested_at: string;
  completed_at?: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [spots, setSpots] = useState<Record<string, { name: string }>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const supabase = getSupabaseClient();

        // Load user rides
        const { data: ridesData, error: ridesError } = await supabase
          .from("rides")
          .select("*")
          .eq("user_id", user.id)
          .order("requested_at", { ascending: false })
          .limit(10);

        if (ridesError) throw ridesError;
        setRides(ridesData || []);

        // Load spots for display
        const { data: spotsData } = await supabase
          .from("spots")
          .select("id, name");

        if (spotsData) {
          const spotsMap: Record<string, { name: string }> = {};
          spotsData.forEach((spot) => {
            spotsMap[spot.id] = { name: spot.name };
          });
          setSpots(spotsMap);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

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
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalRides = rides.length;
  const completedRides = rides.filter((r) => r.status === "completed").length;
  const totalSpent = rides
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + (r.fare || 0), 0);
  const co2Saved = rides
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + (r.distance || 0) * 0.2, 0); // ~0.2kg CO2 per km saved

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 dark:from-emerald-950 dark:via-lime-950 dark:to-amber-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
            Welcome back, {user.email?.split("@")[0] || "User"}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your AirBear journey dashboard
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rides</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalRides}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {completedRides}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  ${totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {co2Saved.toFixed(1)}kg
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Book a Ride
              </CardTitle>
              <CardDescription>
                Find available AirBears and book your next ride
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600">
                <Link href="/map">View Map & Book</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="p-6 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Ride History
              </CardTitle>
              <CardDescription>
                View all your past and upcoming rides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="#rides">View History</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Rides */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
            <CardDescription>Your latest AirBear journeys</CardDescription>
          </CardHeader>
          <CardContent>
            {rides.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-semibold mb-2">No rides yet</p>
                <p className="text-muted-foreground mb-4">
                  Book your first AirBear ride to get started!
                </p>
                <Button asChild className="bg-gradient-to-r from-emerald-500 to-emerald-600">
                  <Link href="/map">Book Your First Ride</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {rides.map((ride) => {
                  const pickupSpot = spots[ride.pickup_spot_id];
                  const dropoffSpot = spots[ride.dropoff_spot_id];
                  const statusColors: Record<string, string> = {
                    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                    accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                    in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
                    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                  };

                  return (
                    <div
                      key={ride.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={statusColors[ride.status] || "bg-gray-100 text-gray-800"}
                            >
                              {ride.status.replace("_", " ").toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(ride.requested_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm">
                                {pickupSpot?.name || "Unknown"} → {dropoffSpot?.name || "Unknown"}
                              </span>
                            </div>
                            {ride.distance && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Navigation className="w-4 h-4" />
                                {ride.distance.toFixed(1)} km
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">
                            ${ride.fare?.toFixed(2) || "0.00"}
                          </p>
                          {ride.completed_at && (
                            <p className="text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {new Date(ride.completed_at).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




