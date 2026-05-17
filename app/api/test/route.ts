import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Missing env vars", url: !!url, key: !!key }, { status: 500 });
  }

  try {
    const res = await fetch(`${url}/rest/v1/hb_competitors?select=concorrente&limit=3`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json({ ok: true, status: res.status, data, url_prefix: url.slice(0, 30) });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
