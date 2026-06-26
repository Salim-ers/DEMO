import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Revoke private-workspace access. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("so_access", "", { path: "/", maxAge: 0 });
  return res;
}
