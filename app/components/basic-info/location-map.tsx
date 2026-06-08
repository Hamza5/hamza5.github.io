"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-clock/dist/Clock.css";
import Clock from "react-clock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloud,
  faCloudSun,
  faCloudRain,
  faCloudShowersHeavy,
  faSnowflake,
  faSmog,
  faBolt,
  faWind,
  faTemperatureHalf,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Location } from "../../data/profile";

interface LocationMapProps {
  location: Location;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns a "fake" Date whose getHours/getMinutes/getSeconds equal the
 * wall-clock time in the target timezone — used by react-clock which
 * internally calls getHours() etc.
 */
function getLocalDate(timezone: string): Date {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return new Date(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour) % 24,
    Number(p.minute),
    Number(p.second),
  );
}

function getHijriDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("en", {
      calendar: "islamic-umalqura",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// WMO weather code mapping — FontAwesome icons, no emojis
// ---------------------------------------------------------------------------

const WMO: Record<number, { label: string; icon: IconDefinition }> = {
  0:  { label: "Clear sky",          icon: faSun },
  1:  { label: "Mainly clear",       icon: faCloudSun },
  2:  { label: "Partly cloudy",      icon: faCloudSun },
  3:  { label: "Overcast",           icon: faCloud },
  45: { label: "Fog",                icon: faSmog },
  48: { label: "Rime fog",           icon: faSmog },
  51: { label: "Light drizzle",      icon: faCloudRain },
  53: { label: "Drizzle",            icon: faCloudRain },
  55: { label: "Heavy drizzle",      icon: faCloudRain },
  61: { label: "Slight rain",        icon: faCloudRain },
  63: { label: "Rain",               icon: faCloudShowersHeavy },
  65: { label: "Heavy rain",         icon: faCloudShowersHeavy },
  71: { label: "Slight snow",        icon: faSnowflake },
  73: { label: "Snow",               icon: faSnowflake },
  75: { label: "Heavy snow",         icon: faSnowflake },
  77: { label: "Snow grains",        icon: faSnowflake },
  80: { label: "Rain showers",       icon: faCloudShowersHeavy },
  81: { label: "Rain showers",       icon: faCloudShowersHeavy },
  82: { label: "Heavy showers",      icon: faCloudShowersHeavy },
  85: { label: "Snow showers",       icon: faSnowflake },
  86: { label: "Heavy snow showers", icon: faSnowflake },
  95: { label: "Thunderstorm",       icon: faBolt },
  96: { label: "Thunderstorm",       icon: faBolt },
  99: { label: "Thunderstorm",       icon: faBolt },
};

function wmoInfo(code: number) {
  return WMO[code] ?? { label: "Unknown", icon: faCloud };
}

// ---------------------------------------------------------------------------
// WeatherWidget
// ---------------------------------------------------------------------------

interface WeatherData {
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
}

function WeatherWidget({ latitude, longitude }: { latitude: number; longitude: number }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code` +
      `&wind_speed_unit=kmh`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const c = data.current;
        setWeather({
          temperature:    c.temperature_2m,
          feelsLike:      c.apparent_temperature,
          windSpeed:      c.wind_speed_10m,
          windDirection:  c.wind_direction_10m,
          weatherCode:    c.weather_code,
        });
      })
      .catch(() => {/* hide silently */});
  }, [latitude, longitude]);

  if (!weather) return null;

  const { label, icon } = wmoInfo(weather.weatherCode);

  return (
    <div className="map-weather">
      <div className="map-weather-main">
        <FontAwesomeIcon icon={icon} className="map-weather-icon" />
        <span className="map-weather-label">{label}</span>
      </div>
      <div className="map-weather-stats">
        <span>
          <FontAwesomeIcon icon={faTemperatureHalf} className="map-weather-stat-icon" />
          {Math.round(weather.temperature)}°C
        </span>
        <span className="map-weather-muted">
          feels {Math.round(weather.feelsLike)}°C
        </span>
        <span>
          <FontAwesomeIcon
            icon={faLocationArrow}
            className="map-weather-stat-icon"
            style={{ transform: `rotate(${weather.windDirection - 45}deg)` }}
          />
          {Math.round(weather.windSpeed)} km/h
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LocalClock — analog + Hijri date + Gregorian date
// ---------------------------------------------------------------------------

function LocalClock({ timezone }: { timezone: string }) {
  const [clockDate, setClockDate] = useState<Date | null>(null);
  const [timeStr, setTimeStr]     = useState("");
  const [gregStr, setGregStr]     = useState("");
  const [hijriStr, setHijriStr]   = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClockDate(getLocalDate(timezone));
      setTimeStr(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: timezone, hour: "2-digit", minute: "2-digit",
          second: "2-digit", hour12: false,
        }).format(now),
      );
      setGregStr(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: timezone, weekday: "short", day: "2-digit",
          month: "short", year: "numeric",
        }).format(now),
      );
      setHijriStr(getHijriDate(now));
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  if (!clockDate) return null;

  return (
    <div className="map-clock">
      <div className="map-clock-analog">
        <Clock
          value={clockDate}
          size={80}
          renderNumbers={false}
          className="map-clock-face"
        />
      </div>
      <div className="map-clock-dates">
        <span className="map-clock-time">{timeStr}</span>
        {hijriStr && <span className="map-clock-hijri">{hijriStr}</span>}
        <span className="map-clock-date">{gregStr}</span>
      </div>
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
      <WeatherWidget latitude={latitude} longitude={longitude} />
      <div className="map-label">{label}</div>
    </div>
  );
}
