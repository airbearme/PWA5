import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getSupabaseClient } from '@/lib/supabase-client';

interface DriverLocation {
    latitude: number;
    longitude: number;
    heading: number;
    speed: number;
    accuracy: number;
    timestamp: number;
}

/**
 * Hook for drivers to share their real-time location
 * Automatically tracks GPS and updates the airbear position in Supabase
 */
export function useDriverLocation(airbearId: string) {
    const { user } = useAuth();
    const [isTracking, setIsTracking] = useState(false);
    const [location, setLocation] = useState<DriverLocation | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Performance Optimization: Throttle Supabase updates to reduce network and database load.
    // Local UI still updates immediately for a smooth experience.
    const lastUpdateRef = useRef<number>(0);
    const timeoutRef = useRef<any>(null);
    const THROTTLE_MS = 5000;

    useEffect(() => {
        // Only track if user is a driver
        if (!user || user.role !== 'driver') return;
        if (!airbearId) return;

        const supabase = getSupabaseClient(false);
        if (!supabase) {
            setError('Supabase not configured');
            return;
        }

        let watchId: number;

        const startTracking = () => {
            if (!navigator.geolocation) {
                setError('Geolocation not supported');
                return;
            }

            setIsTracking(true);

            // Watch position with high accuracy
            watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const newLocation: DriverLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        heading: position.coords.heading || 0,
                        speed: position.coords.speed || 0,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp,
                    };

                    setLocation(newLocation);
                    setError(null);

                    const updateSupabase = async (loc: DriverLocation) => {
                        try {
                            const { error: updateError } = await supabase
                                .from('airbears')
                                .update({
                                    latitude: loc.latitude,
                                    longitude: loc.longitude,
                                    heading: loc.heading,
                                    updated_at: new Date().toISOString(),
                                })
                                .eq('id', airbearId);

                            if (updateError) {
                                console.error('Failed to update airbear location:', updateError);
                                setError(updateError.message);
                            }
                        } catch (err: any) {
                            console.error('Location update error:', err);
                            setError(err.message);
                        }
                    };

                    // Leading-edge + Trailing-edge throttle:
                    // Ensures immediate updates but also guarantees the final position is synced.
                    const now = Date.now();
                    if (now - lastUpdateRef.current >= THROTTLE_MS) {
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                            timeoutRef.current = null;
                        }
                        lastUpdateRef.current = now;
                        updateSupabase(newLocation);
                    } else {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        timeoutRef.current = setTimeout(() => {
                            lastUpdateRef.current = Date.now();
                            updateSupabase(newLocation);
                            timeoutRef.current = null;
                        }, THROTTLE_MS - (now - lastUpdateRef.current));
                    }
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    setError(err.message);
                    setIsTracking(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        };

        startTracking();

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
                setIsTracking(false);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [user, airbearId]);

    return { isTracking, location, error };
}

/**
 * Hook for customers and admins to subscribe to airbear location updates
 * Uses Supabase Realtime for instant updates and polling as a fallback
 */
export function useAirbearLocationUpdates() {
    const [airbears, setAirbears] = useState<any[]>([]);
    const supabase = getSupabaseClient(false);

    useEffect(() => {
        if (!supabase) return;

        // Initial fetch
        const fetchAirbears = async () => {
            const { data, error } = await supabase
                .from('airbears')
                .select('*');

            if (!error && data) {
                setAirbears(data);
            }
        };

        fetchAirbears();

        // 1. Subscribe to Realtime updates
        const channel = supabase
            .channel('airbear-locations')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'airbears',
                },
                (payload) => {
                    setAirbears((prev) =>
                        prev.map((bear) =>
                            bear.id === payload.new.id ? { ...bear, ...payload.new } : bear
                        )
                    );
                }
            )
            .subscribe();

        // 2. Poll as fallback (every 10 seconds, less aggressive than before since we have Realtime)
        const interval = setInterval(fetchAirbears, 10000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, [supabase]);

    return airbears;
}
