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
      // Get user location
      const position = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          timeout: 10000, enableHighAccuracy: true,
        })
      );

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setUserLat(lat);
      setUserLng(lng);

      // Fetch facilities from backend
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
      <div style={{ padding: "8px 16px 16px" }}>
        {error && (
          <div style={{
            fontFamily: "'JetBrains Mono'", fontSize: "10px",
            color: "#ff6b6b", marginBottom: "8px", textAlign: "center",
          }}>{error}</div>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={findFacilities}
          disabled={loading}
          style={{
            width: "100%", padding: "12px",
            background: "rgba(0,201,167,0.06)",
            border: "1px solid rgba(0,201,167,0.2)",
            borderRadius: "12px", cursor: loading ? "wait" : "pointer",
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "8px",
            transition: "all 0.2s",
          }}
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Loader2 size={16} color="#00c9a7" />
            </motion.div>
          ) : (
            <MapPin size={16} color="#00c9a7" />
          )}
          <span style={{
            fontFamily: "'JetBrains Mono'", fontSize: "11px",
            color: "#00c9a7", letterSpacing: "1px",
          }}>
            {loading ? "FINDING NEARBY FACILITIES..." : "FIND NEARBY HOSPITALS & CLINICS"}
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
