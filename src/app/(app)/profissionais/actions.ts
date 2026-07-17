"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirLogin } from "@/lib/auth";
import { texto, textoObrig, inteiro, listaCsv } from "@/lib/form";

export async function criarProfissional(formData: FormData) {
  await exigirLogin();

  await prisma.profissional.create({
    data: {
      nome: textoObrig(formData, "nome"),
      telefone: textoObrig(formData, "telefone"),
      categoria: textoObrig(formData, "categoria"),
      coren: texto(formData, "coren"),
      especialidades: listaCsv(formData, "especialidades") ?? texto(formData, "especialidades"),
      cidade: textoObrig(formData, "cidade"),
      bairro: texto(formData, "bairro"),
      raioKm: inteiro(formData, "raioKm"),
      valorDiurno: inteiro(formData, "valorDiurno"),
      valorNoturno: inteiro(formData, "valorNoturno"),
      valor24h: inteiro(formData, "valor24h"),
      valorMensal: inteiro(formData, "valorMensal"),
      disponibilidade: texto(formData, "disponibilidade"),
      prazoRecebimentoDias: inteiro(formData, "prazoRecebimentoDias"),
      observacoes: texto(formData, "observacoes"),
    },
  });

  revalidatePath("/profissionais");
  redirect("/profissionais");
}

export async function atualizarProfissional(id: string, formData: FormData) {
  await exigirLogin();

  await prisma.profissional.update({
    where: { id },
    data: {
      nome: textoObrig(formData, "nome"),
      telefone: textoObrig(formData, "telefone"),
      categoria: textoObrig(formData, "categoria"),
      coren: texto(formData, "coren"),
      especialidades: texto(formData, "especialidades"),
      cidade: textoObrig(formData, "cidade"),
      bairro: texto(formData, "bairro"),
      raioKm: inteiro(formData, "raioKm"),
      valorDiurno: inteiro(formData, "valorDiurno"),
      valorNoturno: inteiro(formData, "valorNoturno"),
      valor24h: inteiro(formData, "valor24h"),
      valorMensal: inteiro(formData, "valorMensal"),
      disponibilidade: texto(formData, "disponibilidade"),
      prazoRecebimentoDias: inteiro(formData, "prazoRecebimentoDias"),
      observacoes: texto(formData, "observacoes"),
    },
  });

  revalidatePath(`/profissionais/${id}`);
  revalidatePath("/profissionais");
  redirect(`/profissionais/${id}`);
}

/** Registra a verificação manual do COREN (CUI-12): marca, data e quem verificou. */
export async function verificarCoren(id: string, formData: FormData) {
  await exigirLogin();
  const por = textoObrig(formData, "verificadoPor");

  await prisma.profissional.update({
    where: { id },
    data: {
      corenVerificado: true,
      corenVerificadoEm: new Date(),
      corenVerificadoPor: por,
    },
  });

  revalidatePath(`/profissionais/${id}`);
}

export async function alternarAtivo(id: string, ativo: boolean) {
  await exigirLogin();
  await prisma.profissional.update({ where: { id }, data: { ativo } });
  revalidatePath("/profissionais");
  revalidatePath(`/profissionais/${id}`);
}
