/* ──────────────────────────────────────────────
 *  POST /api/analytics
 *
 *  Receives anonymous analytics events from the
 *  client and logs them server-side.
 * ────────────────────────────────────────────── */

import { NextResponse } from "next/server";
import { logEvent, parseAnalyticsBody } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    const event = parseAnalyticsBody(raw);

    if (!event) {
      return NextResponse.json({ error: "Invalid event." }, { status: 400 });
    }

    await logEvent(event);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process event." },
      { status: 500 }
    );
  }
}
