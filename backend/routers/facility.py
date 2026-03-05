from fastapi import APIRouter, HTTPException, Query
import httpx
import math

router = APIRouter(prefix="/api", tags=["Facility"])

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance in km between two coordinates."""
    R = 6371
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

# Fallback facilities for when API is unavailable
FALLBACK_FACILITIES = [
    {
        "id": "1", "name": "Primary Health Centre",
        "type": "PHC", "distance_km": 1.2,
        "address": "Nearest PHC to your location",
        "lat": 0, "lng": 0, "phone": "108",
        "open": True, "emergency": False,
    },
    {
        "id": "2", "name": "Community Health Centre",
        "type": "CHC", "distance_km": 3.5,
        "address": "Nearest CHC to your location",
        "lat": 0, "lng": 0, "phone": "108",
        "open": True, "emergency": True,
    },
    {
        "id": "3", "name": "District Hospital",
        "type": "Hospital", "distance_km": 8.0,
        "address": "Nearest District Hospital",
        "lat": 0, "lng": 0, "phone": "108",
        "open": True, "emergency": True,
    },
]

@router.get("/facilities")
async def get_facilities(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    radius_km: float = Query(10.0, description="Search radius in km"),
    limit: int = Query(5, description="Max facilities to return"),
):
    try:
        # Try OpenStreetMap Overpass API (free, no key needed)
        overpass_url = "https://overpass-api.de/api/interpreter"
        query = f"""
        [out:json][timeout:15];
        (
          node["amenity"="hospital"](around:{radius_km * 1000},{lat},{lng});
          node["amenity"="clinic"](around:{radius_km * 1000},{lat},{lng});
          node["amenity"="health_post"](around:{radius_km * 1000},{lat},{lng});
          node["healthcare"="centre"](around:{radius_km * 1000},{lat},{lng});
          way["amenity"="hospital"](around:{radius_km * 1000},{lat},{lng});
        );
        out center {limit * 2};
        """

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(overpass_url, data={"data": query})
            data = response.json()

        facilities = []
        for element in data.get("elements", []):
            tags = element.get("tags", {})

            # Get coordinates
            if element["type"] == "node":
                f_lat = element.get("lat", 0)
                f_lng = element.get("lon", 0)
            else:
                center = element.get("center", {})
                f_lat = center.get("lat", 0)
                f_lng = center.get("lon", 0)

            if not f_lat or not f_lng:
                continue

            # Calculate distance
            distance = haversine_distance(lat, lng, f_lat, f_lng)

            # Determine facility type
            amenity = tags.get("amenity", "")
            healthcare = tags.get("healthcare", "")
            if amenity == "hospital":
                ftype = "Hospital"
            elif amenity == "clinic":
                ftype = "Clinic"
            elif healthcare == "centre":
                ftype = "Health Centre"
            else:
                ftype = "PHC"

            name = (
                tags.get("name") or
                tags.get("name:en") or
                f"{ftype} ({distance:.1f}km away)"
            )

            facilities.append({
                "id":          str(element.get("id", "")),
                "name":        name,
                "type":        ftype,
                "distance_km": round(distance, 2),
                "address":     tags.get("addr:full") or tags.get("addr:street") or "Address not available",
                "lat":         f_lat,
                "lng":         f_lng,
                "phone":       tags.get("phone") or tags.get("contact:phone") or "108",
                "open":        True,
                "emergency":   amenity == "hospital",
            })

        # Sort by distance
        facilities.sort(key=lambda x: x["distance_km"])
        facilities = facilities[:limit]

        if not facilities:
            # Return fallback with actual coordinates
            fallback = []
            for i, f in enumerate(FALLBACK_FACILITIES[:limit]):
                f_copy = f.copy()
                f_copy["lat"] = lat + (i * 0.01)
                f_copy["lng"] = lng + (i * 0.01)
                fallback.append(f_copy)
            return {"facilities": fallback, "source": "fallback", "total": len(fallback)}

        return {"facilities": facilities, "source": "openstreetmap", "total": len(facilities)}

    except Exception as e:
        print(f"Facility API error: {e}")
        fallback = []
        for i, f in enumerate(FALLBACK_FACILITIES[:limit]):
            f_copy = f.copy()
            f_copy["lat"] = lat + (i * 0.01)
            f_copy["lng"] = lng + (i * 0.01)
            fallback.append(f_copy)
        return {"facilities": fallback, "source": "fallback", "total": len(fallback)}
