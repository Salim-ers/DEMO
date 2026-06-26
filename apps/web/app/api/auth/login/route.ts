import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ACCESS_CODE = process.env.STUDIO_ONE_ACCESS_CODE || "studio-one";

/** Grant private-workspace access if the shared code matches. Sets an httpOnly cookie. */
export async function POST(req: Request) {
  let code = "";
  try {
    const body = (await req.json()) as { code?: string };
    code = (body.code ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (code !== ACCESS_CODE) {
    return NextResponse.json({ error: "Code d’accès incorrect." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("so_access", ACCESS_CODE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
