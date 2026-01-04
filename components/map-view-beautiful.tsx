"use client";

import { useEffect, useRef, useState, memo } from "react";
import type { AirbearLocation } from "@/lib/supabase/realtime";
import type { Database } from "@/lib/types/database";

export type Spot = Database["public"]["Tables"]["spots"]["Row"];

interface MapViewProps {
  spots: Spot[];
  airbears: AirbearLocation[];
  onSpotSelect?: (spot: Spot) => void;
}

// ⚡ Bolt: Wrapped MapView with React.memo to prevent unnecessary re-renders.
// This is crucial for performance because the parent component might re-render
// frequently, passing a new `onSpotSelect` function instance. Without memoization,
// this would trigger a costly regeneration of all map markers.
const MapView = memo(function MapView({
  spots,
  airbears,
  onSpotSelect,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const LeafletRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    const initMap = async () => {
      try {
        // Preload Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          link.crossOrigin = "anonymous";
          document.head.appendChild(link);
          
          // Wait for CSS to load
          await new Promise((resolve) => {
            link.onload = resolve;
            link.onerror = resolve; // Continue even if CSS fails
            setTimeout(resolve, 100); // Timeout fallback
          });
        }

        // Dynamically import Leaflet
        const L = (await import("leaflet")).default;
        
        if (!L || !L.map) {
          throw new Error("Leaflet failed to load");
        }
        LeafletRef.current = L;

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // Ensure map container has dimensions
        if (!mapRef.current || mapRef.current.offsetHeight === 0) {
          throw new Error("Map container has no height");
        }

        // Create map centered on Binghamton, NY
        const binghamtonCenter: [number, number] = [42.0987, -75.9179];
        const map = L.map(mapRef.current!, {
          center: binghamtonCenter,
          zoom: 13,
          zoomControl: true,
          preferCanvas: true,
        });
        
        // Invalidate size to ensure map renders
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

        // Use beautiful CartoDB Positron tiles (free, beautiful, no API key needed)
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
            tileSize: 256,
            zoomOffset: 0,
          }
        ).addTo(map);

        // Add custom styling for Binghamton
        map.on("load", () => {
          setMapLoaded(true);
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);
        
        // Setup global booking function
        if (typeof window !== "undefined" && onSpotSelect) {
          (window as any).selectSpotForBooking = (spotId: string) => {
            const spot = spots.find(s => s.id === spotId);
            if (spot) {
              onSpotSelect(spot);
            }
          };
        }
      } catch (error) {
        console.error("❌ Error initializing map:", error);
        setMapLoaded(false);
        // Show error to user
        if (typeof window !== "undefined") {
          alert(`Map loading error: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !LeafletRef.current || !mapLoaded) return;

    const map = mapInstanceRef.current;
    const L = LeafletRef.current;

    // Remove old spot markers
    markersRef.current.forEach((marker, id) => {
      if (id.startsWith("spot-")) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add spot markers with beautiful styling
    spots.forEach((spot) => {
      const airbearsAtSpot = airbears.filter(
        (a) => a.current_spot_id === spot.id && a.is_available
      );
      const hasAvailableAirbears = airbearsAtSpot.length > 0;

      const icon = L.divIcon({
        html: `
          <div style="position: relative; cursor: pointer; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
            <div style="
              width: 56px;
              height: 56px;
              background: ${
                hasAvailableAirbears
                  ? "linear-gradient(135deg, #10b981, #059669, #047857)"
                  : "linear-gradient(135deg, #9ca3af, #6b7280)"
              };
              border: 5px solid white;
              border-radius: 50%;
              box-shadow: 0 6px 20px rgba(0,0,0,0.3), 
                          0 0 0 3px ${
                            hasAvailableAirbears
                              ? "rgba(16, 185, 129, 0.3)"
                              : "rgba(107, 114, 128, 0.3)"
                          },
                          inset 0 2px 4px rgba(255,255,255,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 28px;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              animation: ${
                hasAvailableAirbears
                  ? "pulse-glow 2s ease-in-out infinite"
                  : "none"
              };
            " 
            onmouseover="this.style.transform='scale(1.15)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.4), 0 0 0 5px ${
              hasAvailableAirbears
                ? "rgba(16, 185, 129, 0.5)"
                : "rgba(107, 114, 128, 0.5)"
            }'" 
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3), 0 0 0 3px ${
              hasAvailableAirbears
                ? "rgba(16, 185, 129, 0.3)"
                : "rgba(107, 114, 128, 0.3)"
            }'">
              🐻
            </div>
            ${
              hasAvailableAirbears
                ? `
              <div style="
                position: absolute;
                top: -10px;
                right: -10px;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                border: 4px solid white;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
                animation: pulse 1.5s ease-in-out infinite;
              ">${airbearsAtSpot.length}</div>
            `
                : ""
            }
          </div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.9; }
            }
            @keyframes pulse-glow {
              0%, 100% { 
                box-shadow: 0 6px 20px rgba(0,0,0,0.3), 0 0 0 3px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.4);
              }
              50% { 
                box-shadow: 0 6px 20px rgba(0,0,0,0.3), 0 0 0 5px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.8);
              }
            }
          </style>
        `,
        className: "bg-transparent border-0",
        iconSize: [56, 56],
        iconAnchor: [28, 56],
        popupAnchor: [0, -56],
      });

      const marker = L.marker([spot.latitude, spot.longitude], { icon }).addTo(
        map
      );

      const popupContent = `
        <div style="min-width: 240px; padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #1f2937; background: linear-gradient(135deg, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${
            spot.name
          }</h3>
          ${
            spot.description
              ? `<p style="margin-bottom: 12px; color: #6b7280; font-size: 14px; line-height: 1.5;">${spot.description}</p>`
              : ""
          }
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 10px; background: ${
            hasAvailableAirbears
              ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
              : "#f3f4f6"
          }; border-radius: 10px; border: 2px solid ${
        hasAvailableAirbears ? "#10b981" : "#9ca3af"
      };">
            <div style="width: 20px; height: 20px; background: ${
              hasAvailableAirbears ? "#10b981" : "#9ca3af"
            }; border-radius: 50%; box-shadow: 0 0 12px ${
        hasAvailableAirbears ? "#10b981" : "#9ca3af"
      }; animation: ${
        hasAvailableAirbears ? "pulse 2s ease-in-out infinite" : "none"
      };"></div>
            <span style="font-weight: 700; color: ${
              hasAvailableAirbears ? "#047857" : "#4b5563"
            }; font-size: 15px;">${airbearsAtSpot.length} AirBear${
        airbearsAtSpot.length !== 1 ? "s" : ""
      } available</span>
          </div>
          ${
            spot.amenities && spot.amenities.length > 0
              ? `
            <div style="font-size: 13px; color: #6b7280; background: linear-gradient(135deg, #f9fafb, #f3f4f6); padding: 8px 12px; border-radius: 8px; border-left: 4px solid #10b981;">
              <strong style="color: #1f2937;">✨ Amenities:</strong> ${spot.amenities.join(
                ", "
              )}
            </div>
          `
              : ""
          }
        </div>
      `;

      // Add booking button to popup
      const bookingButton = `
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <button 
            onclick="window.selectSpotForBooking('${spot.id}')"
            style="
              width: 100%;
              padding: 10px 16px;
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
            "
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.5)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(16, 185, 129, 0.3)'"
          >
            📍 Book from Here
          </button>
        </div>
      `;

      marker.bindPopup(popupContent + bookingButton, {
        maxWidth: 300,
        className: "beautiful-popup",
      });

      // Setup click handler for booking
      marker.on("click", () => {
        if (onSpotSelect) {
          onSpotSelect(spot);
        }
      });

      markersRef.current.set(`spot-${spot.id}`, marker);
    });
  }, [spots, airbears, onSpotSelect, mapLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !LeafletRef.current || !mapLoaded) return;

    const map = mapInstanceRef.current;
    const L = LeafletRef.current;

    // Update airbear markers
    airbears.forEach((airbear) => {
      const markerId = `airbear-${airbear.id}`;
      let marker = markersRef.current.get(markerId);

      const icon = L.divIcon({
        html: `
          <div style="position: relative; cursor: pointer; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
            <div style="
              width: 48px;
              height: 48px;
              background: linear-gradient(135deg, ${
                airbear.is_available ? "#10b981" : "#6b7280"
              }, ${airbear.is_available ? "#059669" : "#4b5563"});
              border: 4px solid white;
              border-radius: 50%;
              box-shadow: 0 6px 18px rgba(0,0,0,0.35), 
                          0 0 0 4px ${
                            airbear.is_available
                              ? "rgba(16, 185, 129, 0.25)"
                              : "rgba(107, 114, 128, 0.25)"
                          },
                          inset 0 2px 4px rgba(255,255,255,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              animation: ${
                airbear.is_available
                  ? "pulse-glow 2s ease-in-out infinite"
                  : "none"
              };
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            " 
            onmouseover="this.style.transform='scale(1.2)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.4), 0 0 0 6px ${
              airbear.is_available
                ? "rgba(16, 185, 129, 0.4)"
                : "rgba(107, 114, 128, 0.4)"
            }'" 
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 6px 18px rgba(0,0,0,0.35), 0 0 0 4px ${
              airbear.is_available
                ? "rgba(16, 185, 129, 0.25)"
                : "rgba(107, 114, 128, 0.25)"
            }'">
              🚲
            </div>
            ${
              airbear.is_charging
                ? `
              <div style="
                position: absolute;
                top: -8px;
                right: -8px;
                background: linear-gradient(135deg, #fbbf24, #f59e0b);
                border-radius: 50%;
                width: 22px;
                height: 22px;
                border: 3px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                box-shadow: 0 4px 12px rgba(251, 191, 36, 0.6);
                animation: pulse 1.5s ease-in-out infinite;
              ">⚡</div>
            `
                : ""
            }
          </div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.15); opacity: 0.9; }
            }
            @keyframes pulse-glow {
              0%, 100% { 
                box-shadow: 0 6px 18px rgba(0,0,0,0.35), 0 0 0 4px rgba(16, 185, 129, 0.25), 0 0 20px rgba(16, 185, 129, 0.4);
              }
              50% { 
                box-shadow: 0 6px 18px rgba(0,0,0,0.35), 0 0 0 6px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.8);
              }
            }
          </style>
        `,
        className: "bg-transparent border-0",
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24],
      });

      if (marker) {
        marker.setLatLng([airbear.latitude, airbear.longitude]);
        marker.setIcon(icon);
      } else {
        marker = L.marker([airbear.latitude, airbear.longitude], {
          icon,
        }).addTo(map);

        const batteryColor =
          airbear.battery_level > 50
            ? "#10b981"
            : airbear.battery_level > 20
            ? "#f59e0b"
            : "#ef4444";

        const popupContent = `
          <div style="min-width: 220px; padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
            <h4 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #1f2937; background: linear-gradient(135deg, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">AirBear #${airbear.id.slice(
              -4
            )}</h4>
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: linear-gradient(135deg, #f9fafb, #f3f4f6); border-radius: 8px; border-left: 4px solid ${batteryColor};">
                <span style="color: #6b7280; font-weight: 600;">🔋 Battery:</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 70px; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="width: ${
                      airbear.battery_level
                    }%; height: 100%; background: linear-gradient(90deg, ${batteryColor}, ${batteryColor}dd); transition: width 0.3s; box-shadow: 0 0 8px ${batteryColor}80;"></div>
                  </div>
                  <span style="font-weight: 700; color: ${batteryColor}; font-size: 15px;">${
          airbear.battery_level
        }%</span>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px; background: linear-gradient(135deg, #f9fafb, #f3f4f6); border-radius: 8px; border-left: 4px solid ${
                airbear.is_available ? "#10b981" : "#6b7280"
              };">
                <span style="color: #6b7280; font-weight: 600;">Status:</span>
                <span style="font-weight: 700; color: ${
                  airbear.is_available ? "#10b981" : "#6b7280"
                };">
                  ${
                    airbear.is_charging
                      ? "⚡ Charging"
                      : airbear.is_available
                      ? "✓ Available"
                      : "🚴 In Use"
                  }
                </span>
              </div>
              <div style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 4px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                🕐 Last updated: ${new Date(
                  airbear.updated_at
                ).toLocaleTimeString()}
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 280,
          className: "beautiful-popup",
        });
        markersRef.current.set(markerId, marker);
      }
    });

    // Remove markers for airbears that no longer exist
    markersRef.current.forEach((marker, id) => {
      if (id.startsWith("airbear-")) {
        const airbearId = id.replace("airbear-", "");
        if (!airbears.find((a) => a.id === airbearId)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      }
    });
  }, [airbears, mapLoaded]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[600px] rounded-xl overflow-hidden shadow-2xl border-4 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-lime-50"
        style={{ minHeight: "600px" }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-950/50 to-lime-950/50 dark:from-emerald-950/50 dark:to-lime-950/50 rounded-xl z-10 backdrop-blur-sm">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
                <img
                  src="/airbear-mascot.png"
                  alt="AirBear Mascot"
                  className="w-full h-full object-cover rounded-full animate-pulse-glow"
                />
              </div>
            </div>
            <p className="text-lg font-semibold text-emerald-400 dark:text-emerald-300 animate-pulse">
              Loading beautiful Binghamton map...
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export default MapView;
