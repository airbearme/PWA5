"use client"

import { useEffect, useRef } from "react"
import type { AirbearLocation } from "@/lib/supabase/realtime"
import type { Database } from "@/lib/types/database"

export type Spot = Database["public"]["Tables"]["spots"]["Row"]

interface MapViewProps {
  spots: Spot[]
  airbears: AirbearLocation[]
  onSpotSelect?: (spot: Spot) => void
}

export default function MapView({ spots, airbears, onSpotSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const spotLastCountRef = useRef<Map<string, number>>(new Map())
  const airbearLastStatusRef = useRef<Map<string, string>>(new Map())
  const LeafletRef = useRef<any>(null)



  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) {
      return
    }

    const initMap = async () => {
      try {
        // Preload Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)
        }

        // Dynamically import Leaflet for code splitting
        const L = (await import("leaflet")).default
        LeafletRef.current = L

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })

        // Create map centered on Binghamton, NY
        const binghamtonCenter: [number, number] = [42.0987, -75.9179]
        const map = L.map(mapRef.current!, {
          center: binghamtonCenter,
          zoom: 13,
          zoomControl: true,
          preferCanvas: true, // Better performance for many markers
        })

        // Use optimized tile layer with better caching
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          tileSize: 256,
          zoomOffset: 0,
        }).addTo(map)

        mapInstanceRef.current = map
      } catch (error) {
        console.error("❌ Error initializing map:", error)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !LeafletRef.current) return

    const map = mapInstanceRef.current
    const L = LeafletRef.current

    // Pre-calculate available airbear counts per spot (O(S+A) optimization)
    const countsBySpot = airbears.reduce((acc, a) => {
      if (a.is_available && a.current_spot_id) {
        acc[a.current_spot_id] = (acc[a.current_spot_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Update spot markers
    spots.forEach((spot) => {
      const count = countsBySpot[spot.id] || 0;
      const hasAvailableAirbears = count > 0;
      const markerId = `spot-${spot.id}`;
      let marker = markersRef.current.get(markerId);

      // Only update icon if count or availability status changed
      if (marker && spotLastCountRef.current.get(markerId) === count) {
        return;
      }

      const icon = L.divIcon({
        html: `
          <div style="position: relative; cursor: pointer;">
            <div style="
              width: 48px;
              height: 48px;
              background: ${hasAvailableAirbears ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #9ca3af, #6b7280)"};
              border: 4px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
              🐻
            </div>
            ${
              hasAvailableAirbears
                ? `
              <div style="
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                font-weight: bold;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              ">${count}</div>
            `
                : ""
            }
          </div>
        `,
        className: "bg-transparent border-0",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48],
      })

      const popupContent = `
        <div style="min-width: 220px; padding: 8px;">
          <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #1f2937;">${spot.name}</h3>
          ${spot.description ? `<p style="margin-bottom: 12px; color: #6b7280; font-size: 14px;">${spot.description}</p>` : ""}
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 8px; background: ${hasAvailableAirbears ? "#ecfdf5" : "#f3f4f6"}; border-radius: 8px;">
            <div style="width: 16px; height: 16px; background: ${hasAvailableAirbears ? "#10b981" : "#9ca3af"}; border-radius: 50%; box-shadow: 0 0 8px ${hasAvailableAirbears ? "#10b981" : "#9ca3af"};"></div>
            <span style="font-weight: 600; color: ${hasAvailableAirbears ? "#047857" : "#4b5563"}; font-size: 14px;">${count} AirBear${count !== 1 ? "s" : ""} available</span>
          </div>
          ${
            spot.amenities && spot.amenities.length > 0
              ? `
            <div style="font-size: 13px; color: #6b7280; background: #f9fafb; padding: 6px 10px; border-radius: 6px;">
              <strong>Amenities:</strong> ${spot.amenities.join(", ")}
            </div>
          `
              : ""
          }
        </div>
      `

      if (marker) {
        marker.setIcon(icon);
        marker.setPopupContent(popupContent);
      } else {
        marker = L.marker([spot.latitude, spot.longitude], { icon }).addTo(map)
        marker.bindPopup(popupContent, { maxWidth: 300 })

        if (onSpotSelect) {
          marker.on("click", () => onSpotSelect(spot))
        }

        markersRef.current.set(markerId, marker)
      }

      spotLastCountRef.current.set(markerId, count);
    })

    // Remove old spot markers
    markersRef.current.forEach((marker, id) => {
      if (id.startsWith("spot-")) {
        const spotId = id.replace("spot-", "");
        if (!spots.find(s => s.id === spotId)) {
          marker.remove();
          markersRef.current.delete(id);
          spotLastCountRef.current.delete(id);
        }
      }
    });
  }, [spots, airbears, onSpotSelect])

  useEffect(() => {
    if (!mapInstanceRef.current || !LeafletRef.current) return

    const map = mapInstanceRef.current
    const L = LeafletRef.current

    airbears.forEach((airbear) => {
      const markerId = `airbear-${airbear.id}`
      let marker = markersRef.current.get(markerId)
      const status = `${airbear.is_available}-${airbear.is_charging}`;

      // Only update position if status hasn't changed
      if (marker && airbearLastStatusRef.current.get(markerId) === status) {
        marker.setLatLng([airbear.latitude, airbear.longitude]);
        return;
      }

      const icon = L.divIcon({
        html: `
          <div style="position: relative; cursor: pointer;">
            <div style="
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, ${airbear.is_available ? "#10b981" : "#6b7280"}, ${airbear.is_available ? "#059669" : "#4b5563"});
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 4px ${airbear.is_available ? "rgba(16, 185, 129, 0.2)" : "rgba(107, 114, 128, 0.2)"};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              animation: ${airbear.is_available ? "map-pulse 2s infinite" : "none"};
              transition: transform 0.3s;
            " onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
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
                width: 18px;
                height: 18px;
                border: 2px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              ">⚡</div>
            `
                : ""
            }
          </div>
        `,
        className: "bg-transparent border-0",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      })

      if (marker) {
        marker.setLatLng([airbear.latitude, airbear.longitude])
        marker.setIcon(icon)
      } else {
        marker = L.marker([airbear.latitude, airbear.longitude], { icon }).addTo(map)

        const batteryColor = airbear.battery_level > 50 ? "#10b981" : airbear.battery_level > 20 ? "#f59e0b" : "#ef4444"

        const popupContent = `
          <div style="min-width: 200px; padding: 8px;">
            <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 12px; color: #1f2937;">AirBear #${airbear.id.slice(-4)}</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px; background: #f9fafb; border-radius: 6px;">
                <span style="color: #6b7280;">Battery:</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div style="width: 60px; height: 10px; background: #e5e7eb; border-radius: 5px; overflow: hidden;">
                    <div style="width: ${airbear.battery_level}%; height: 100%; background: ${batteryColor}; transition: width 0.3s;"></div>
                  </div>
                  <span style="font-weight: 600; color: ${batteryColor};">${airbear.battery_level}%</span>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 6px; background: #f9fafb; border-radius: 6px;">
                <span style="color: #6b7280;">Status:</span>
                <span style="font-weight: 600; color: ${airbear.is_available ? "#10b981" : "#6b7280"};">
                  ${airbear.is_charging ? "⚡ Charging" : airbear.is_available ? "✓ Available" : "🚴 In Use"}
                </span>
              </div>
              <div style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 4px;">
                Last updated: ${new Date(airbear.updated_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        `

        marker.bindPopup(popupContent, { maxWidth: 250 })
        markersRef.current.set(markerId, marker)
      }

      airbearLastStatusRef.current.set(markerId, status);
    })

    markersRef.current.forEach((marker, id) => {
      if (id.startsWith("airbear-")) {
        const airbearId = id.replace("airbear-", "")
        if (!airbears.find((a) => a.id === airbearId)) {
          marker.remove()
          markersRef.current.delete(id)
          airbearLastStatusRef.current.delete(id)
        }
      }
    })
  }, [airbears])

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes map-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}} />
      <div 
        ref={mapRef} 
        className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 bg-gray-100"
        style={{ minHeight: "600px" }}
      />
    </div>
  )
}