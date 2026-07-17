import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NOME_COOKIE } from "@/lib/auth";
import { NOME_COOKIE_PRO } from "@/lib/auth-pro";

// Três zonas (checagem otimista só de presença; a verificação real, assinada,
// é feita nas páginas com exigirLogin/exigirProfissional):
//   público   → /pro, /pro/cadastro, /pro/entrar
//   profissional → /pro/conta        (exige cookie do profissional)
//   operador  → todo o resto         (exige cookie do operador)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const temOperador = request.cookies.has(NOME_COOKIE);
  const temPro = request.cookies.has(NOME_COOKIE_PRO);

  // Login do operador
  if (pathname === "/login") {
    return temOperador
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  // Zona do profissional
  if (pathname.startsWith("/pro")) {
    const publicasPro = pathname === "/pro" || pathname === "/pro/cadastro" || pathname === "/pro/entrar";
    if (publicasPro) return NextResponse.next();
    // /pro/conta e demais → exige sessão de profissional
    if (!temPro) return NextResponse.redirect(new URL("/pro/entrar", request.url));
    return NextResponse.next();
  }

  // Zona do operador (tudo o mais)
  if (!temOperador) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
