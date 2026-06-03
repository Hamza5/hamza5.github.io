"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Location } from "../../data/profile";

interface LocationMapProps {
  location: Location;
}

function LocalClock({ timezone }: { timezone: string }) {
  const [datetime, setDatetime] = useState<{ time: string; date: string } | null>(null);

  useEffect(() => {
    const fmt = (now: Date) => ({
      time: new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now),
      date: new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(now),
    });

    setDatetime(fmt(new Date()));
    const id = setInterval(() => setDatetime(fmt(new Date())), 1000);
    return () => clearInterval(id);
  }, [timezone]);

  if (!datetime) return null;

  return (
    <div className="map-clock">
      <span className="map-clock-time">{datetime.time}</span>
      <span className="map-clock-date">{datetime.date}</span>
    </div>
  );
}

// Custom synthwave-styled marker — avoids the broken default Leaflet icon
const markerIcon = divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"
      fill="#00fff7" fill-opacity="0.9"/>
    <circle cx="12" cy="12" r="5" fill="#050510"/>
  </svg>`,
  className: "",
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

export default function LocationMap({ location }: LocationMapProps) {
  const { latitude, longitude, timezone, city, country, district } = location;
  const center: [number, number] = [latitude, longitude];
  const label = [district, city, country].filter(Boolean).join(", ");

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="location-map-wrapper">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        zoomControl={false}
        className="location-map"
      >
        <TileLayer
          key={tileUrl}
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Marker position={center} icon={markerIcon} />
      </MapContainer>
      <LocalClock timezone={timezone} />
      <div className="map-label">{label}</div>
    </div>
  );
}
