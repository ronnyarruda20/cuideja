"use server";

import { redirect } from "next/navigation";
import { fecharSessao } from "@/lib/auth";

export async function sair() {
  await fecharSessao();
  redirect("/login");
}
