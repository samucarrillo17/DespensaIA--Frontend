import { NextResponse, type NextRequest } from "next/server"

const AUTH_COOKIE = "token"

/**
 * Proxy (ex-middleware en Next 16): protege las rutas privadas.
 * Cualquier ruta bajo /dashboard/inicio requiere la cookie del token;
 * sin ella, redirige a /login.
 */
export default function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/inicio", "/dashboard/inicio/:path*"],
}
