"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirLogin } from "@/lib/auth";
import { texto, textoObrig, inteiro, listaCsv, data, simNao } from "@/lib/form";

export async function criarNecessidade(formData: FormData) {
  await exigirLogin();

  const n = await prisma.necessidade.create({
    data: {
      familiaNome: textoObrig(formData, "familiaNome"),
      familiaTelefone: textoObrig(formData, "familiaTelefone"),
      pacienteRelacao: texto(formData, "pacienteRelacao"),
      cidade: textoObrig(formData, "cidade"),
      bairro: texto(formData, "bairro"),
      tarefas: listaCsv(formData, "tarefas"),
      periodo: texto(formData, "periodo"),
      dataInicio: data(formData, "dataInicio"),
      duracao: texto(formData, "duracao"),
      urgencia: texto(formData, "urgencia"),
      orcamentoEsperado: inteiro(formData, "orcamentoEsperado"),
      canal: texto(formData, "canal"),
      pagaAntecipado: simNao(formData, "pagaAntecipado"),
      observacoes: texto(formData, "observacoes"),
    },
  });

  revalidatePath("/necessidades");
  redirect(`/necessidades/${n.id}`);
}

export async function atualizarStatusNecessidade(id: string, status: string) {
  await exigirLogin();
  await prisma.necessidade.update({ where: { id }, data: { status } });
  revalidatePath(`/necessidades/${id}`);
  revalidatePath("/necessidades");
}
