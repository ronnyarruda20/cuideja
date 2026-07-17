import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirLogin } from "@/lib/auth";
import { FormProfissional } from "../FormProfissional";
import { atualizarProfissional, verificarCoren } from "../actions";
import { Cartao } from "@/components/campos";

export default async function DetalheProfissional({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirLogin();
  const { id } = await params;
  const p = await prisma.profissional.findUnique({ where: { id } });
  if (!p) notFound();

  const atualizar = atualizarProfissional.bind(null, p.id);
  const verificar = verificarCoren.bind(null, p.id);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/profissionais" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Profissionais
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{p.nome}</h1>
      </div>

      {/* Verificação de COREN — CUI-12 */}
      <Cartao className="space-y-3">
        <h2 className="font-medium">Verificação de COREN</h2>
        {p.corenVerificado ? (
          <p className="text-sm text-emerald-700">
            ✓ Verificado por <strong>{p.corenVerificadoPor}</strong> em{" "}
            {p.corenVerificadoEm?.toLocaleDateString("pt-BR")}.
          </p>
        ) : (
          <>
            <p className="text-sm text-neutral-500">
              Consulte o CPF no SIGEN (sigen.cofen.gov.br/profissional/consultar), confirme registro
              ativo e categoria, e registre aqui. Guarde o print à parte.
            </p>
            <form action={verificar} className="flex flex-wrap items-end gap-3">
              <label className="text-sm font-medium text-neutral-700">
                Verificado por
                <input
                  name="verificadoPor"
                  required
                  placeholder="seu nome"
                  className="mt-1 block rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                />
              </label>
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                Marcar como verificado
              </button>
            </form>
          </>
        )}
      </Cartao>

      {/* Experiência informada no autocadastro — dado de entrevista (CUI-18/20/32) */}
      {p.autocadastro && (
        <Cartao className="space-y-2 text-sm">
          <h2 className="font-medium">Experiência informada no cadastro</h2>
          <ExpLinha label="Como consegue trabalho hoje" valor={p.comoConsegueTrabalho ?? "—"} />
          <ExpLinha label="Plantões no último mês" valor={p.plantoesUltimoMes?.toString() ?? "—"} />
          <ExpLinha label="Dias para receber hoje" valor={p.prazoRecebimentoDias != null ? `${p.prazoRecebimentoDias} dias` : "—"} />
          <ExpLinha label="Já levou calote" valor={p.jaLevouCalote == null ? "—" : p.jaLevouCalote ? "sim" : "não"} />
          <ExpLinha label="Já pagou por lead" valor={p.jaPagouPorLead == null ? "—" : p.jaPagouPorLead ? "sim" : "não"} />
          <ExpLinha label="Comissão que acha justa" valor={p.comissaoAceita != null ? `${p.comissaoAceita}%` : "—"} />
          <p className="border-t border-neutral-100 pt-2 text-xs text-neutral-400">
            Declarado pelo profissional, não validado. A comissão real só o CUI-25 confirma.
          </p>
        </Cartao>
      )}

      <FormProfissional action={atualizar} profissional={p} rotuloBotao="Salvar alterações" />
    </div>
  );
}

function ExpLinha({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right text-neutral-800">{valor}</span>
    </div>
  );
}
