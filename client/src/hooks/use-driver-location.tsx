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

    // ⚡ Bolt: Throttling refs to minimize database writes
    const lastUpdateRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingLocationRef = useRef<DriverLocation | null>(null);

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

            // ⚡ Bolt: Define update function for throttling
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
                    lastUpdateRef.current = Date.now();
                } catch (err: any) {
                    console.error('Location update error:', err);
                    setError(err.message);
                }
            };

            // Watch position with high accuracy
            watchId = navigator.geolocation.watchPosition(
                (position) => {
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

                    // ⚡ Bolt: Throttled update to Supabase (5 second interval)
                    // This prevents excessive DB writes if the GPS fires frequently
                    const now = Date.now();
                    const throttleInterval = 5000;
                    pendingLocationRef.current = newLocation;

                    if (now - lastUpdateRef.current >= throttleInterval) {
                        // Leading edge update
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                            timeoutRef.current = null;
                        }
                        updateSupabase(newLocation);
                    } else if (!timeoutRef.current) {
                        // Schedule trailing edge update
                        const delay = throttleInterval - (now - lastUpdateRef.current);
                        timeoutRef.current = setTimeout(() => {
                            if (pendingLocationRef.current) {
                                updateSupabase(pendingLocationRef.current);
                            }
                            timeoutRef.current = null;
                        }, delay);
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
