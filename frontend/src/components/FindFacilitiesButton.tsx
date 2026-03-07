"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const FacilityMap = dynamic(() => import("./FacilityMap"), { ssr: false });

interface Facility {
  id: string; name: string; type: string;
  distance_km: number; address: string;
  lat: number; lng: number;
  phone: string; open: boolean; emergency: boolean;
}

export default function FindFacilitiesButton() {
  const [loading, setLoading]       = useState(false);
  const [showMap, setShowMap]       = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [userLat, setUserLat]       = useState(0);
  const [userLng, setUserLng]       = useState(0);
  const [error, setError]           = useState("");

  const findFacilities = async () => {
    setLoading(true);
    setError("");

    try {
      const position = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          timeout: 10000, enableHighAccuracy: true,
        })
      );

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setUserLat(lat);
      setUserLng(lng);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/facilities?lat=${lat}&lng=${lng}&radius_km=10&limit=6`
      );
      const data = await res.json();

      setFacilities(data.facilities || []);
      setShowMap(true);
    } catch (err: any) {
      if (err.code === 1) {
        setError("Location access denied. Please allow location access.");
      } else {
        setError("Could not find facilities. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {error && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
            color: "#9B1C1C", marginBottom: "6px",
          }}>{error}</div>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={findFacilities}
          disabled={loading}
          style={{
            padding: "7px 14px",
            background: "rgba(224,123,57,0.07)",
            border: "1px solid rgba(224,123,57,0.25)",
            borderRadius: "8px", cursor: loading ? "wait" : "pointer",
            display: "flex", alignItems: "center",
            gap: "7px", transition: "all 0.2s",
          }}
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Loader2 size={14} color="#E07B39" />
            </motion.div>
          ) : (
            <MapPin size={14} color="#E07B39" />
          )}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
            color: "#E07B39", letterSpacing: "0.8px",
          }}>
            {loading ? "FINDING..." : "FIND HOSPITALS & CLINICS"}
          </span>
        </motion.button>
      </div>

      {showMap && facilities.length > 0 && (
        <FacilityMap
          userLat={userLat}
          userLng={userLng}
          facilities={facilities}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
}
