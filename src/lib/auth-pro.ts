import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Autenticação do profissional (autocadastro). Login pelo telefone + senha.
// Sem OTP/SMS por enquanto — otimização posterior (CUI-33).

const COOKIE = "cuidaja_pro";

function segredo(): string {
  const s = process.env.APP_SESSION_SECRET;
  if (!s) throw new Error("APP_SESSION_SECRET não definido no .env");
  return s;
}

// --- Senha (scrypt nativo) ---------------------------------------------------

export function hashSenha(senha: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(senha, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verificarSenha(senha: string, armazenado: string | null): boolean {
  if (!armazenado) return false;
  const [salt, hash] = armazenado.split(":");
  if (!salt || !hash) return false;
  const calc = scryptSync(senha, salt, 64);
  const orig = Buffer.from(hash, "hex");
  if (calc.length !== orig.length) return false;
  return timingSafeEqual(calc, orig);
}

// --- Sessão (cookie assinado com o id do profissional) -----------------------

function assinar(id: string): string {
  return createHmac("sha256", segredo()).update(`pro:${id}`).digest("hex");
}

function valorSessao(id: string): string {
  return `${id}.${assinar(id)}`;
}

function idDaSessao(valor: string | undefined): string | null {
  if (!valor) return null;
  const i = valor.lastIndexOf(".");
  if (i < 0) return null;
  const id = valor.slice(0, i);
  const sig = valor.slice(i + 1);
  const esperado = assinar(id);
  const a = Buffer.from(sig);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? id : null;
}

export async function abrirSessaoPro(id: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, valorSessao(id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });
}

export async function fecharSessaoPro(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function profissionalIdDaSessao(): Promise<string | null> {
  const jar = await cookies();
  return idDaSessao(jar.get(COOKIE)?.value);
}

/** Barreira das páginas do profissional. Redireciona pro login se não autenticado. */
export async function exigirProfissional(): Promise<string> {
  const id = await profissionalIdDaSessao();
  if (!id) redirect("/pro/entrar");
  return id;
}

export const NOME_COOKIE_PRO = COOKIE;
