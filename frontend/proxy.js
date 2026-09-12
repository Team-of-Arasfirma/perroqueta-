import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const excluded = /^(\/admin|\/api|\/_next|\/favicon\.ico|\/robots\.txt|\/sitemap(?:-pages|-products|-blog)?\.xml)/;
const asset = /\.(png|jpe?g|webp|svg|gif|ico|css|js|map|pdf|woff2?|ttf)$/i;

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;
  if (excluded.test(pathname) || asset.test(pathname)) return NextResponse.next();
  try {
    const response = await fetch(API_BASE + "/api/redirects/resolve?path=" + encodeURIComponent(pathname), { cache: "no-store" });
    if (!response.ok) return NextResponse.next();
    const data = await response.json();
    if (!data.found || !data.redirect?.destinationPath) return NextResponse.next();
    let destination = data.redirect.destinationPath;
    if (destination.startsWith("/") && !destination.includes("?") && request.nextUrl.search) destination += request.nextUrl.search;
    return NextResponse.redirect(new URL(destination, request.url), { status: data.redirect.statusCode });
  } catch {
    return NextResponse.next();
  }
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
