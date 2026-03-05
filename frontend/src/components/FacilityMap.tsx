"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { Phone, Navigation, X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const callBtnStyle: React.CSSProperties = {
  width: "32px", height: "32px",
  borderRadius: "50%",
  background: "rgba(0,201,167,0.08)",
  border: "1px solid rgba(0,201,167,0.2)",
  display: "flex", alignItems: "center",
  justifyContent: "center",
  color: "#00c9a7", cursor: "pointer",
};

const dirBtnStyle: React.CSSProperties = {
  width: "32px", height: "32px",
  borderRadius: "50%",
  background: "rgba(59,158,255,0.08)",
  border: "1px solid rgba(59,158,255,0.2)",
  display: "flex", alignItems: "center",
  justifyContent: "center",
  color: "#3b9eff", cursor: "pointer",
};

const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#00c9a7;border:3px solid #fff;box-shadow:0 0 0 3px rgba(0,201,167,0.3)"></div>`,
  className: "",
  iconAnchor: [8, 8],
});

const getHospitalIcon = (type: string) => L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:${type === "Hospital" ? "#ff6b6b" : "#ffd166"};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
  className: "",
  iconAnchor: [7, 7],
});

interface Facility {
  id:          string;
  name:        string;
  type:        string;
  distance_km: number;
  address:     string;
  lat:         number;
  lng:         number;
  phone:       string;
  open:        boolean;
  emergency:   boolean;
}

interface Props {
  userLat:    number;
  userLng:    number;
  facilities: Facility[];
  onClose:    () => void;
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 13); }, [lat, lng, map]);
  return null;
}

export default function FacilityMap({
  userLat, userLng, facilities, onClose,
}: Props) {
  const [selected, setSelected] = useState<Facility | null>(null);

  const cardBg    = (f: Facility) => selected?.id === f.id ? "rgba(0,201,167,0.06)" : "transparent";
  const dotBg     = (f: Facility) => f.type === "Hospital" ? "rgba(255,107,107,0.1)" : "rgba(255,209,102,0.1)";
  const dotBorder = (f: Facility) => f.type === "Hospital" ? "1px solid rgba(255,107,107,0.3)" : "1px solid rgba(255,209,102,0.3)";
  const dotColor  = (f: Facility) => f.type === "Hospital" ? "#ff6b6b" : "#ffd166";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(7,13,15,0.95)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid #0e2530",
        background: "#0c1a1f",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            fontFamily: "'DM Serif Display'",
            fontSize: "18px", color: "#dde8f0",
          }}>
            Nearby{" "}
            <span style={{ color: "#00c9a7", fontStyle: "italic" }}>
              Facilities
            </span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono'",
            fontSize: "10px", color: "#1e6050", letterSpacing: "1.5px",
          }}>
            {facilities.length} FACILITIES FOUND NEAR YOU
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "rgba(255,107,107,0.1)",
            border: "1px solid rgba(255,107,107,0.2)",
            color: "#ff6b6b", borderRadius: "8px",
            padding: "8px 12px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "'JetBrains Mono'", fontSize: "11px",
          }}
        >
          <X size={14} /> CLOSE
        </button>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={[userLat, userLng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; CARTO"
          />
          <MapUpdater lat={userLat} lng={userLng} />

          {/* User location */}
          <Marker position={[userLat, userLng]} icon={userIcon}>
            <Popup>
              <div style={{ fontFamily: "monospace", fontSize: "12px" }}>
                📍 Your Location
              </div>
            </Popup>
          </Marker>

          {/* Radius circle */}
          <Circle
            center={[userLat, userLng]}
            radius={5000}
            pathOptions={{
              color: "#00c9a7", fillColor: "#00c9a7",
              fillOpacity: 0.03, weight: 1, dashArray: "4",
            }}
          />

          {/* Facility markers */}
          {facilities.map((f) => (
            <Marker
              key={f.id}
              position={[f.lat, f.lng]}
              icon={getHospitalIcon(f.type)}
              eventHandlers={{ click: () => setSelected(f) }}
            >
              <Popup>
                <div style={{
                  fontFamily: "sans-serif",
                  fontSize: "12px",
                  minWidth: "160px",
                }}>
                  <strong>{f.name}</strong>
                  <br />
                  <span style={{ color: "#666" }}>
                    {f.type} · {f.distance_km}km
                  </span>
                  <br />
                  📞 {f.phone}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Facility list */}
      <div style={{
        background: "#0c1a1f",
        borderTop: "1px solid #0e2530",
        maxHeight: "240px",
        overflowY: "auto",
      }}>
        {facilities.map((f, i) => (
          <div
            key={f.id}
            onClick={() => setSelected(f)}
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #0a1520",
              display: "flex", alignItems: "center",
              gap: "14px", cursor: "pointer",
              background: cardBg(f),
              transition: "background 0.2s",
            }}
          >
            {/* Index dot */}
            <div style={{
              width: "28px", height: "28px",
              borderRadius: "50%",
              background: dotBg(f),
              border: dotBorder(f),
              display: "flex", alignItems: "center",
              justifyContent: "center",
              fontFamily: "'JetBrains Mono'",
              fontSize: "11px",
              color: dotColor(f),
              flexShrink: 0,
            }}>
              {i + 1}
            </div>

            {/* Facility info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Outfit'", fontSize: "13px",
                color: "#c8daea", fontWeight: 500,
                whiteSpace: "nowrap", overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {f.name}
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: "10px", color: "#1e4060", marginTop: "2px",
              }}>
                {f.type} · {f.distance_km} km away
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${f.phone}`;
                }}
                style={callBtnStyle}
              >
                <Phone size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`,
                    "_blank"
                  );
                }}
                style={dirBtnStyle}
              >
                <Navigation size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
