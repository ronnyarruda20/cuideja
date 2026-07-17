"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  hashSenha,
  verificarSenha,
  abrirSessaoPro,
  fecharSessaoPro,
  exigirProfissional,
} from "@/lib/auth-pro";
import { texto, textoObrig, inteiro, simNao } from "@/lib/form";

export async function cadastrar(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const nome = texto(formData, "nome");
  const telefone = texto(formData, "telefone");
  const senha = texto(formData, "senha");
  const categoria = texto(formData, "categoria");
  const cidade = texto(formData, "cidade");

  if (!nome || !telefone || !senha || !categoria || !cidade) {
    return "Preencha nome, telefone, senha, categoria e cidade.";
  }
  if (senha.length < 6) {
    return "A senha precisa de pelo menos 6 caracteres.";
  }

  let profId: string;
  try {
    const p = await prisma.profissional.create({
      data: {
        nome,
        telefone,
        senhaHash: hashSenha(senha),
        autocadastro: true,
        categoria,
        coren: texto(formData, "coren"),
        cidade,
        bairro: texto(formData, "bairro"),
        especialidades: texto(formData, "especialidades"),
        disponibilidade: texto(formData, "disponibilidade"),
        valorDiurno: inteiro(formData, "valorDiurno"),
        valorNoturno: inteiro(formData, "valorNoturno"),
        valor24h: inteiro(formData, "valor24h"),
        valorMensal: inteiro(formData, "valorMensal"),
        // Experiência (entrevista estruturada)
        comoConsegueTrabalho: texto(formData, "comoConsegueTrabalho"),
        plantoesUltimoMes: inteiro(formData, "plantoesUltimoMes"),
        prazoRecebimentoDias: inteiro(formData, "prazoRecebimentoDias"),
        jaLevouCalote: simNao(formData, "jaLevouCalote"),
        jaPagouPorLead: simNao(formData, "jaPagouPorLead"),
        comissaoAceita: inteiro(formData, "comissaoAceita"),
      },
    });
    profId = p.id;
  } catch (err) {
    if ((err as { code?: string }).code === "P2002") {
      return "Já existe uma conta com esse telefone. Use a opção Entrar.";
    }
    throw err;
  }

  await abrirSessaoPro(profId);
  redirect("/pro/conta?novo=1");
}

export async function entrar(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const telefone = textoObrig(formData, "telefone");
  const senha = textoObrig(formData, "senha");

  const p = await prisma.profissional.findUnique({ where: { telefone } });
  if (!p || !verificarSenha(senha, p.senhaHash)) {
    return "Telefone ou senha incorretos.";
  }

  await abrirSessaoPro(p.id);
  redirect("/pro/conta");
}

export async function sairPro() {
  await fecharSessaoPro();
  redirect("/pro");
}

/** O profissional edita o próprio perfil. Id vem da sessão, nunca do form. */
export async function atualizarMeuPerfil(formData: FormData) {
  const id = await exigirProfissional();

  await prisma.profissional.update({
    where: { id },
    data: {
      cidade: textoObrig(formData, "cidade"),
      bairro: texto(formData, "bairro"),
      especialidades: texto(formData, "especialidades"),
      disponibilidade: texto(formData, "disponibilidade"),
      valorDiurno: inteiro(formData, "valorDiurno"),
      valorNoturno: inteiro(formData, "valorNoturno"),
      valor24h: inteiro(formData, "valor24h"),
      valorMensal: inteiro(formData, "valorMensal"),
      ativo: formData.get("ativo") != null,
    },
  });

  revalidatePath("/pro/conta");
}
