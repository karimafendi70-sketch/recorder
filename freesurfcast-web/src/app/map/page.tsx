/* ──────────────────────────────────────────────
 *  /map – Interactive spot map page
 * ────────────────────────────────────────────── */

import type { Metadata } from "next";
import { MapPageClient } from "./MapPageClient";

export const metadata: Metadata = {
  title: "Spot Map — FreeSurfCast",
  description: "Browse all surf spots on an interactive map and jump straight to their forecast.",
};

export default function MapPage() {
  return <MapPageClient />;
}
