"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exigirLogin } from "@/lib/auth";
import { texto, inteiro } from "@/lib/form";

function recarregar(necessidadeId: string) {
  revalidatePath(`/necessidades/${necessidadeId}`);
  revalidatePath("/necessidades");
  revalidatePath("/");
}

/** Sugere um profissional para uma necessidade (cria a proposta em SUGERIDO). */
export async function sugerirProfissional(necessidadeId: string, profissionalId: string) {
  await exigirLogin();

  const jaExiste = await prisma.proposta.findFirst({
    where: { necessidadeId, profissionalId },
  });
  if (!jaExiste) {
    await prisma.proposta.create({ data: { necessidadeId, profissionalId } });
    // Publicar a necessidade coloca ela "em match".
    await prisma.necessidade.update({
      where: { id: necessidadeId },
      data: { status: "EM_MATCH" },
    });
  }
  recarregar(necessidadeId);
}

/**
 * Move a proposta no funil e carimba os marcos temporais que alimentam os KPIs.
 * SUGERIDO → ENVIADA → ACEITA → EM_ANDAMENTO → CONCLUIDA (ou RECUSADA/CANCELADA).
 */
export async function moverProposta(
  propostaId: string,
  necessidadeId: string,
  status: string
) {
  await exigirLogin();

  const atual = await prisma.proposta.findUnique({ where: { id: propostaId } });
  if (!atual) return;

  const dados: Record<string, unknown> = { status };
  const agora = new Date();

  // enviadaEm = primeira vez que vira ENVIADA (tempo até 1ª proposta — CUI-26).
  if (status === "ENVIADA" && !atual.enviadaEm) dados.enviadaEm = agora;
  if (status === "ACEITA" && !atual.aceitaEm) dados.aceitaEm = agora;
  if (status === "CONCLUIDA" && !atual.concluidaEm) dados.concluidaEm = agora;

  await prisma.proposta.update({ where: { id: propostaId }, data: dados });

  // Aceitar uma proposta preenche a necessidade (fill rate — CUI-26).
  if (status === "ACEITA") {
    await prisma.necessidade.update({
      where: { id: necessidadeId },
      data: { status: "PREENCHIDA" },
    });
  }

  recarregar(necessidadeId);
}

export async function definirValorProposta(
  propostaId: string,
  necessidadeId: string,
  formData: FormData
) {
  await exigirLogin();
  await prisma.proposta.update({
    where: { id: propostaId },
    data: { valorCombinado: inteiro(formData, "valorCombinado") },
  });
  recarregar(necessidadeId);
}

export async function marcarRecorrente(
  propostaId: string,
  necessidadeId: string,
  recorrente: boolean
) {
  await exigirLogin();
  await prisma.proposta.update({ where: { id: propostaId }, data: { recorrente } });
  recarregar(necessidadeId);
}

/** Registra vazamento/desintermediação (CUI-31). */
export async function marcarVazamento(
  propostaId: string,
  necessidadeId: string,
  formData: FormData
) {
  await exigirLogin();
  await prisma.proposta.update({
    where: { id: propostaId },
    data: { vazou: true, vazouMotivo: texto(formData, "vazouMotivo") },
  });
  recarregar(necessidadeId);
}

export async function removerProposta(propostaId: string, necessidadeId: string) {
  await exigirLogin();
  await prisma.proposta.delete({ where: { id: propostaId } });
  recarregar(necessidadeId);
}

export async function avaliar(
  propostaId: string,
  necessidadeId: string,
  formData: FormData
) {
  await exigirLogin();
  const notaNum = inteiro(formData, "nota");
  const de = texto(formData, "de");
  if (!notaNum || !de) return;
  await prisma.avaliacao.create({
    data: { propostaId, de, nota: notaNum, comentario: texto(formData, "comentario") },
  });
  recarregar(necessidadeId);
}
