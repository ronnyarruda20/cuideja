import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirLogin } from "@/lib/auth";
import { Cartao } from "@/components/campos";
import {
  rotulo,
  rotulosDeLista,
  formatarReais,
  STATUS_NECESSIDADE,
} from "@/lib/dominio";
import { atualizarStatusNecessidade } from "../actions";
import {
  sugerirProfissional,
  moverProposta,
  definirValorProposta,
  marcarRecorrente,
  marcarVazamento,
  removerProposta,
  avaliar,
} from "./actions";

const PROXIMO_STATUS: Record<string, { status: string; rotulo: string; cor: string }[]> = {
  SUGERIDO: [
    { status: "ENVIADA", rotulo: "Marcar proposta enviada", cor: "bg-blue-600 hover:bg-blue-500" },
    { status: "CANCELADA", rotulo: "Cancelar", cor: "bg-neutral-400 hover:bg-neutral-500" },
  ],
  ENVIADA: [
    { status: "ACEITA", rotulo: "Família aceitou", cor: "bg-emerald-600 hover:bg-emerald-500" },
    { status: "RECUSADA", rotulo: "Recusada", cor: "bg-neutral-400 hover:bg-neutral-500" },
  ],
  ACEITA: [
    { status: "EM_ANDAMENTO", rotulo: "Iniciar atendimento", cor: "bg-blue-600 hover:bg-blue-500" },
  ],
  EM_ANDAMENTO: [
    { status: "CONCLUIDA", rotulo: "Concluir", cor: "bg-emerald-600 hover:bg-emerald-500" },
  ],
};

export default async function DetalheNecessidade({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirLogin();
  const { id } = await params;

  const n = await prisma.necessidade.findUnique({
    where: { id },
    include: {
      propostas: {
        include: { profissional: true, avaliacoes: true },
        orderBy: { criadoEm: "asc" },
      },
    },
  });
  if (!n) notFound();

  const propostosIds = new Set(n.propostas.map((p) => p.profissionalId));
  const candidatos = await prisma.profissional.findMany({
    where: { ativo: true, id: { notIn: [...propostosIds] } },
    orderBy: { criadoEm: "desc" },
  });
  // Mesma cidade primeiro.
  candidatos.sort((a, b) => {
    const am = a.cidade.toLowerCase() === n.cidade.toLowerCase() ? 0 : 1;
    const bm = b.cidade.toLowerCase() === n.cidade.toLowerCase() ? 0 : 1;
    return am - bm;
  });

  const primeiraProposta = n.propostas
    .filter((p) => p.enviadaEm)
    .sort((a, b) => a.enviadaEm!.getTime() - b.enviadaEm!.getTime())[0];
  const tempoAteProposta = primeiraProposta
    ? Math.round((primeiraProposta.enviadaEm!.getTime() - n.criadoEm.getTime()) / 60000)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/necessidades" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Necessidades
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {n.familiaNome}
          {n.pacienteRelacao && (
            <span className="ml-2 text-base font-normal text-neutral-400">
              cuidado para {n.pacienteRelacao}
            </span>
          )}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna esquerda: dados + status */}
        <div className="space-y-6">
          <Cartao className="space-y-3 text-sm">
            <h2 className="font-medium">Resumo</h2>
            <Linha label="WhatsApp" valor={n.familiaTelefone} />
            <Linha label="Local" valor={`${n.cidade}${n.bairro ? " · " + n.bairro : ""}`} />
            <Linha label="Tarefas" valor={rotulosDeLista("tarefa", n.tarefas)} />
            <Linha label="Período" valor={rotulo("periodo", n.periodo)} />
            <Linha label="Início" valor={n.dataInicio?.toLocaleDateString("pt-BR") ?? "—"} />
            <Linha label="Duração" valor={rotulo("duracao", n.duracao)} />
            <Linha label="Urgência" valor={rotulo("urgencia", n.urgencia)} />
            <Linha label="Orçamento" valor={formatarReais(n.orcamentoEsperado)} />
            <Linha label="Canal" valor={n.canal ?? "—"} />
            <Linha
              label="Paga antes?"
              valor={n.pagaAntecipado == null ? "não perguntado" : n.pagaAntecipado ? "sim" : "não"}
            />
            {n.observacoes && (
              <p className="border-t border-neutral-100 pt-2 text-neutral-600">{n.observacoes}</p>
            )}
          </Cartao>

          <Cartao className="space-y-3">
            <h2 className="text-sm font-medium">Status da necessidade</h2>
            <div className="flex flex-wrap gap-2">
              {STATUS_NECESSIDADE.map((s) => {
                const acao = atualizarStatusNecessidade.bind(null, n.id, s.valor);
                const ativo = n.status === s.valor;
                return (
                  <form key={s.valor} action={acao}>
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        ativo
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {s.rotulo}
                    </button>
                  </form>
                );
              })}
            </div>
          </Cartao>

          <Cartao className="text-sm">
            <h2 className="font-medium">Métricas desta necessidade</h2>
            <p className="mt-2 text-neutral-600">
              Tempo até 1ª proposta:{" "}
              <strong>{tempoAteProposta != null ? `${tempoAteProposta} min` : "—"}</strong>
            </p>
            <p className="text-neutral-600">
              Propostas: <strong>{n.propostas.length}</strong>
            </p>
          </Cartao>
        </div>

        {/* Coluna direita (2/3): propostas + sugestão */}
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-3">
            <h2 className="font-medium">Propostas</h2>
            {n.propostas.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
                Nenhuma proposta ainda. Sugira profissionais abaixo.
              </p>
            ) : (
              n.propostas.map((p) => (
                <Cartao key={p.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/profissionais/${p.profissional.id}`}
                        className="font-medium hover:underline"
                      >
                        {p.profissional.nome}
                      </Link>
                      <p className="text-xs text-neutral-500">
                        {rotulo("categoria", p.profissional.categoria)} · {p.profissional.cidade}
                        {p.profissional.corenVerificado && " · COREN verificado"}
                      </p>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                      {rotulo("statusProposta", p.status)}
                    </span>
                  </div>

                  {/* Botões de funil */}
                  <div className="flex flex-wrap gap-2">
                    {(PROXIMO_STATUS[p.status] ?? []).map((prox) => (
                      <form key={prox.status} action={moverProposta.bind(null, p.id, n.id, prox.status)}>
                        <button className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white ${prox.cor}`}>
                          {prox.rotulo}
                        </button>
                      </form>
                    ))}
                    <form action={removerProposta.bind(null, p.id, n.id)}>
                      <button className="rounded-lg px-3 py-1.5 text-xs text-neutral-400 hover:text-red-600">
                        remover
                      </button>
                    </form>
                  </div>

                  {/* Valor combinado */}
                  <form
                    action={definirValorProposta.bind(null, p.id, n.id)}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-neutral-500">Valor combinado R$</span>
                    <input
                      name="valorCombinado"
                      type="number"
                      defaultValue={p.valorCombinado ?? undefined}
                      className="w-28 rounded-lg border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-neutral-900"
                    />
                    <button className="rounded-lg bg-neutral-100 px-2 py-1 text-xs hover:bg-neutral-200">
                      salvar
                    </button>
                  </form>

                  {/* Recorrência + vazamento — CUI-31 */}
                  <div className="flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-3 text-xs">
                    <form action={marcarRecorrente.bind(null, p.id, n.id, !p.recorrente)}>
                      <button
                        className={`rounded-full px-3 py-1 font-medium ${
                          p.recorrente
                            ? "bg-indigo-600 text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {p.recorrente ? "✓ recorrente" : "marcar recorrente"}
                      </button>
                    </form>

                    {p.recorrente &&
                      (p.vazou ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-700">
                          vazou{p.vazouMotivo ? `: ${p.vazouMotivo}` : ""}
                        </span>
                      ) : (
                        <form
                          action={marcarVazamento.bind(null, p.id, n.id)}
                          className="flex items-center gap-2"
                        >
                          <input
                            name="vazouMotivo"
                            placeholder="motivo do vazamento"
                            className="rounded-lg border border-neutral-300 px-2 py-1 outline-none focus:border-neutral-900"
                          />
                          <button className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-700 hover:bg-red-100">
                            marcar vazamento
                          </button>
                        </form>
                      ))}
                  </div>

                  {/* Avaliações */}
                  {p.status === "CONCLUIDA" && (
                    <div className="border-t border-neutral-100 pt-3">
                      {p.avaliacoes.length > 0 && (
                        <ul className="mb-2 space-y-1 text-xs text-neutral-600">
                          {p.avaliacoes.map((a) => (
                            <li key={a.id}>
                              <strong>{a.de === "FAMILIA" ? "Família" : "Profissional"}</strong>: {a.nota}/5
                              {a.comentario ? ` — ${a.comentario}` : ""}
                            </li>
                          ))}
                        </ul>
                      )}
                      <form action={avaliar.bind(null, p.id, n.id)} className="flex flex-wrap items-center gap-2 text-xs">
                        <select name="de" className="rounded-lg border border-neutral-300 px-2 py-1">
                          <option value="FAMILIA">Família avalia</option>
                          <option value="PROFISSIONAL">Profissional avalia</option>
                        </select>
                        <select name="nota" className="rounded-lg border border-neutral-300 px-2 py-1">
                          {[5, 4, 3, 2, 1].map((x) => (
                            <option key={x} value={x}>{x}/5</option>
                          ))}
                        </select>
                        <input
                          name="comentario"
                          placeholder="comentário (opcional)"
                          className="flex-1 rounded-lg border border-neutral-300 px-2 py-1 outline-none focus:border-neutral-900"
                        />
                        <button className="rounded-lg bg-neutral-100 px-2 py-1 hover:bg-neutral-200">
                          registrar
                        </button>
                      </form>
                    </div>
                  )}
                </Cartao>
              ))
            )}
          </section>

          {/* Sugerir profissionais */}
          <section className="space-y-3">
            <h2 className="font-medium">Sugerir profissional</h2>
            {candidatos.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Nenhum profissional disponível para sugerir.{" "}
                <Link href="/profissionais/novo" className="underline">Cadastrar um</Link>.
              </p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-neutral-100">
                    {candidatos.map((c) => {
                      const mesmaCidade = c.cidade.toLowerCase() === n.cidade.toLowerCase();
                      return (
                        <tr key={c.id} className="hover:bg-neutral-50">
                          <td className="px-4 py-2">
                            <span className="font-medium">{c.nome}</span>
                            <span className="ml-2 text-xs text-neutral-500">
                              {rotulo("categoria", c.categoria)} · {c.cidade}
                              {mesmaCidade && (
                                <span className="ml-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-emerald-700">
                                  mesma cidade
                                </span>
                              )}
                              {c.corenVerificado && <span className="ml-1 text-emerald-600">✓ COREN</span>}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right text-neutral-600">
                            {formatarReais(c.valorNoturno)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <form action={sugerirProfissional.bind(null, n.id, c.id)}>
                              <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800">
                                Sugerir
                              </button>
                            </form>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Linha({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right text-neutral-800">{valor}</span>
    </div>
  );
}
