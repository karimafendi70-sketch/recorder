/* ──────────────────────────────────────────────
 *  SpotMap – Interactive Leaflet map with spot pins
 *
 *  Shows all 31 SPOT_CATALOG entries as markers.
 *  Clicking "Open forecast" in a popup navigates
 *  to /forecast?spotId=<id>.
 * ────────────────────────────────────────────── */

"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { SPOT_CATALOG, type SurfSpot } from "@/lib/spots/catalog";
import { useLanguage, type TranslationKey } from "../LanguageProvider";
import styles from "./map.module.css";

/* ── Fix default marker icons (webpack strips them) ── */

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

/* ── Difficulty i18n labels ──────────────────── */

const DIFF_I18N: Record<string, TranslationKey> = {
  beginner: "filter.beginner",
  intermediate: "filter.intermediate",
  advanced: "filter.advanced",
  mixed: "filter.mixed",
};

const TYPE_I18N: Record<string, TranslationKey> = {
  beach: "filter.beach",
  reef: "filter.reef",
  point: "filter.point",
  mixed: "filter.mixedType",
};

/* ── Auto-fit bounds helper ──────────────────── */

function FitBounds({ spots }: { spots: SurfSpot[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || spots.length === 0) return;
    const bounds = L.latLngBounds(spots.map((s) => [s.latitude, s.longitude]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
    fitted.current = true;
  }, [map, spots]);

  return null;
}

/* ── Component ───────────────────────────────── */

export function SpotMap() {
  const router = useRouter();
  const { t } = useLanguage();

  const spots = useMemo(
    () => SPOT_CATALOG.filter((s) => s.latitude !== 0 && s.longitude !== 0),
    [],
  );

  /* Default centre: roughly Europe */
  const center: [number, number] = [35, 0];

  return (
    <MapContainer
      center={center}
      zoom={3}
      scrollWheelZoom
      className={styles.leafletMap}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds spots={spots} />

      {spots.map((spot) => (
        <Marker key={spot.id} position={[spot.latitude, spot.longitude]}>
          <Popup autoPan autoPanPadding={L.point(40, 40)} maxWidth={260}>
            <div className={styles.popupContent}>
              <strong className={styles.popupName}>{spot.name}</strong>
              <span className={styles.popupMeta}>
                {spot.region.toUpperCase()} · {spot.country}
              </span>
              <span className={styles.popupTags}>
                <span className={styles.popupTag}>{t(DIFF_I18N[spot.difficultyTag] ?? "filter.mixed")}</span>
                <span className={styles.popupTag}>{t(TYPE_I18N[spot.spotType] ?? "filter.mixedType")}</span>
              </span>
              <button
                type="button"
                className={styles.popupBtn}
                onClick={() => router.push(`/forecast?spotId=${spot.id}`)}
              >
                {t("map.openForecast")}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
