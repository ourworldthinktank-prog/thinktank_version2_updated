import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Best-effort per-instance rate limit (5 requests / 10 min / IP). Replace with a
// shared store (e.g. Vercel KV / Upstash) or Cloudflare rules before heavy traffic.
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > 2048) return NextResponse.json({ error: "too_large" }, { status: 413 });

  let body: { email?: unknown; consent?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Honeypot: bots fill this. Pretend success so they learn nothing.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  // TODO (once accounts exist): verify Cloudflare Turnstile token, then send to the
  // chosen email tool / notification inbox. Record the consent timestamp with the entry.
  const configured = Boolean(process.env.EMAIL_PROVIDER_API_KEY);
  if (!configured) return NextResponse.json({ ok: true, demo: true });

  return NextResponse.json({ ok: true });
}
