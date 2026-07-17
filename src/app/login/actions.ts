"use server";

import { redirect } from "next/navigation";
import { senhaConfere, abrirSessao } from "@/lib/auth";

export async function entrar(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const senha = String(formData.get("senha") ?? "");
  if (!senhaConfere(senha)) {
    return "Senha incorreta.";
  }
  await abrirSessao();
  redirect("/");
}
