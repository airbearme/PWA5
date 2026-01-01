"use client";

import { useEffect, useRef, memo } from "react";
import type { AirbearLocation } from "@/lib/supabase/realtime";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Spot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string | null;
  amenities: string[] | null;
}

interface MapViewProps {
  spots: Spot[];
  airbears: AirbearLocation[];
  onSpotSelect?: (spot: Spot) => void;
}

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// ⚡ Bolt: Memoize MapView to prevent unnecessary re-renders.
// This is a high-impact optimization as map components are often expensive to render.
const MapView = memo(function MapView({
  spots,
  airbears,
  onSpotSelect,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([42.0987, -75.9179], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update spot markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear old spot markers
    markersRef.current.forEach((marker, id) => {
      if (id.startsWith("spot-")) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add spot markers
    spots.forEach((spot) => {
      const airbearsAtSpot = airbears.filter(
        (a) => a.current_spot_id === spot.id && a.is_available
      );
      const hasAvailableAirbears = airbearsAtSpot.length > 0;

      const icon = L.divIcon({
        html: `
          <div style="position: relative;">
            <div style="
              width: 40px;
              height: 40px;
              background: ${hasAvailableAirbears ? "#10b981" : "#9ca3af"};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-center;
              font-size: 20px;
            ">
              🐻
            </div>
            ${
              hasAvailableAirbears
                ? `
              <div style="
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                border: 2px solid white;
              ">${airbearsAtSpot.length}</div>
            `
                : ""
            }
          </div>
        `,
        className: "bg-transparent border-0",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([spot.latitude, spot.longitude], { icon }).addTo(
        map
      );

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">${
            spot.name
          }</h3>
          <p style="margin-bottom: 8px; color: #666;">${
            spot.description || ""
          }</p>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 12px; height: 12px; background: ${
              hasAvailableAirbears ? "#10b981" : "#9ca3af"
            }; border-radius: 50%;"></div>
            <span style="font-weight: 500;">${airbearsAtSpot.length} AirBear${
        airbearsAtSpot.length !== 1 ? "s" : ""
      } available</span>
          </div>
          ${
            spot.amenities && spot.amenities.length > 0
              ? `
            <div style="font-size: 12px; color: #666;">
              Amenities: ${spot.amenities.join(", ")}
            </div>
          `
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent);

      if (onSpotSelect) {
        marker.on("click", () => onSpotSelect(spot));
      }

      markersRef.current.set(`spot-${spot.id}`, marker);
    });
  }, [spots, airbears, onSpotSelect]);

  // Update airbear markers (with real-time updates)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    airbears.forEach((airbear) => {
      const markerId = `airbear-${airbear.id}`;
      let marker = markersRef.current.get(markerId);

      const icon = L.divIcon({
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, ${
              airbear.is_available ? "#10b981" : "#6b7280"
            }, ${airbear.is_available ? "#059669" : "#4b5563"});
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transform: rotate(${airbear.heading}deg);
            animation: pulse 2s infinite;
          ">
            🚲
          </div>
          ${
            airbear.is_charging
              ? `
            <div style="
              position: absolute;
              top: -6px;
              right: -6px;
              background: #fbbf24;
              border-radius: 50%;
              width: 16px;
              height: 16px;
              border: 2px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
            ">⚡</div>
          `
              : ""
          }
        `,
        className: "bg-transparent border-0",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      if (marker) {
        // Update existing marker
        marker.setLatLng([airbear.latitude, airbear.longitude]);
        marker.setIcon(icon);
      } else {
        // Create new marker
        marker = L.marker([airbear.latitude, airbear.longitude], {
          icon,
        }).addTo(map);

        const popupContent = `
          <div style="min-width: 180px;">
            <h4 style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">AirBear #${airbear.id
              .split("-")
              .pop()}</h4>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between;">
                <span>Battery:</span>
                <span style="font-weight: 600; color: ${
                  airbear.battery_level > 50 ? "#10b981" : "#f59e0b"
                };">${airbear.battery_level}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Status:</span>
                <span style="font-weight: 600; color: ${
                  airbear.is_available ? "#10b981" : "#6b7280"
                };">
                  ${
                    airbear.is_charging
                      ? "⚡ Charging"
                      : airbear.is_available
                      ? "✓ Available"
                      : "In Use"
                  }
                </span>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
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
  }, [airbears]);

  return (
    <div
      id="map-container"
      ref={mapRef}
      className="w-full h-[600px] rounded-lg overflow-hidden"
    />
  );
});

export default MapView;
