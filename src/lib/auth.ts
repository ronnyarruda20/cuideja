import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";

// Tranca de acesso da Fatia 1: um único operador (você). NÃO é sistema de contas
// de usuário — é uma porta com cadeado, porque a ferramenta guarda dado sensível
// (CPF, COREN, saúde). Ver CUI-10 (LGPD).

const COOKIE = "cuidaja_session";
const MARCADOR = "operador";

function segredo(): string {
  const s = process.env.APP_SESSION_SECRET;
  if (!s) throw new Error("APP_SESSION_SECRET não definido no .env");
  return s;
}

function assinatura(): string {
  return createHmac("sha256", segredo()).update(MARCADOR).digest("hex");
}

export function valorDaSessao(): string {
  return assinatura();
}

export function sessaoValida(valor: string | undefined): boolean {
  if (!valor) return false;
  const esperado = assinatura();
  const a = Buffer.from(valor);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Confere a senha do operador. */
export function senhaConfere(senha: string): boolean {
  const esperada = process.env.APP_PASSWORD;
  if (!esperada) throw new Error("APP_PASSWORD não definido no .env");
  const a = Buffer.from(senha);
  const b = Buffer.from(esperada);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Barreira real, usada em páginas e ações. Redireciona pro login se não autenticado. */
export async function exigirLogin(): Promise<void> {
  const jar = await cookies();
  if (!sessaoValida(jar.get(COOKIE)?.value)) {
    redirect("/login");
  }
}

export async function abrirSessao(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, valorDaSessao(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  });
}

export async function fecharSessao(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export const NOME_COOKIE = COOKIE;
