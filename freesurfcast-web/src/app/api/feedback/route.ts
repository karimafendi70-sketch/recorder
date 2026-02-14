/* ──────────────────────────────────────────────
 *  POST /api/feedback
 *
 *  Receives feedback submissions from the client.
 *  Current back-end: console.log.
 *  TODO: forward to email service or GitHub Issues API.
 * ────────────────────────────────────────────── */

import { NextResponse } from "next/server";
import { parseFeedbackBody } from "@/lib/feedback";

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    const entry = parseFeedbackBody(raw);

    if (!entry) {
      return NextResponse.json(
        { error: "Invalid feedback payload — type and message are required." },
        { status: 400 }
      );
    }

    console.log("[feedback]", JSON.stringify(entry));

    // TODO: send email via Resend / Postmark / SES
    // TODO: create GitHub issue via Octokit

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process feedback." },
      { status: 500 }
    );
  }
}
