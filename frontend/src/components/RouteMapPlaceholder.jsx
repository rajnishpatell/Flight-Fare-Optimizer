import React, { useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import airports from "../data/airports.json";
import "leaflet/dist/leaflet.css";

/* ---------------- LEAFLET ICON FIX (Vite) ---------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------------- BUILD AIRPORT LOOKUP MAP ---------------- */
const airportMap = airports.reduce((acc, airport) => {
  if (
    airport.iata &&
    typeof airport.lat === "number" &&
    typeof airport.lon === "number"
  ) {
    acc[airport.iata.toUpperCase()] = [airport.lat, airport.lon];
  }
  return acc;
}, {});

/* ---------------- SAFE IATA EXTRACTION ---------------- */
const extractIATACode = (value) => {
  if (!value) return null;

  // Matches "Delhi (DEL)"
  const match = value.match(/\(([^)]+)\)/);
  if (match) return match[1].toUpperCase();

  // Matches "DEL"
  if (value.length === 3) return value.toUpperCase();

  return null;
};

export default function RouteMap({ legs }) {
  /* ---------------- GUARD ---------------- */
  if (!legs || legs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          Route Preview
        </h4>
        <p className="text-gray-500">No route data available</p>
      </div>
    );
  }

  /* ---------------- BUILD PATH SAFELY ---------------- */
  const path = useMemo(() => {
    const points = [];

    legs.forEach((leg) => {
      const fromCode = extractIATACode(leg.from);
      const toCode = extractIATACode(leg.to);

      if (fromCode && airportMap[fromCode]) {
        points.push(airportMap[fromCode]);
      }

      if (toCode && airportMap[toCode]) {
        points.push(airportMap[toCode]);
      }
    });

    return points;
  }, [legs]);

  /* ---------------- FINAL GUARD (NO NaN EVER) ---------------- */
  if (path.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          Route Preview
        </h4>
        <p className="text-gray-500">
          Route coordinates not available for selected airports
        </p>
      </div>
    );
  }

  /* ---------------- MAP CENTER ---------------- */
  const avgLat =
    path.reduce((sum, p) => sum + p[0], 0) / path.length;
  const avgLng =
    path.reduce((sum, p) => sum + p[1], 0) / path.length;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">
        Route Map
      </h4>

      <MapContainer
        center={[avgLat, avgLng]}
        zoom={4}
        scrollWheelZoom={false}
        className="w-full h-64 rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {path.map((pos, idx) => (
          <Marker key={idx} position={pos}>
            <Popup>
              {legs[idx]
                ? `${legs[idx].from} → ${legs[idx].to}`
                : "Stop"}
            </Popup>
          </Marker>
        ))}

        <Polyline positions={path} color="#2563eb" weight={3} />
      </MapContainer>

      <div className="mt-3 text-sm text-gray-600">
        {legs.map((leg, i) => (
          <div key={i}>
            {leg.from} → {leg.to} · {leg.dep} — {leg.arr}
          </div>
        ))}
      </div>
    </div>
  );
}
