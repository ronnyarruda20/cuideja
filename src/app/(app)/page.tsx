import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirLogin } from "@/lib/auth";
import { Cartao } from "@/components/campos";

export default async function Painel() {
  await exigirLogin();

  const [
    totalProf,
    profVerificados,
    necessidades,
    propostasRecorrentes,
    propostasVazadas,
    propostasEnviadas,
  ] = await Promise.all([
    prisma.profissional.count(),
    prisma.profissional.count({ where: { corenVerificado: true } }),
    prisma.necessidade.findMany({
      select: { status: true, criadoEm: true, propostas: { select: { enviadaEm: true } } },
    }),
    prisma.proposta.count({ where: { recorrente: true } }),
    prisma.proposta.count({ where: { recorrente: true, vazou: true } }),
    prisma.proposta.findMany({
      where: { enviadaEm: { not: null } },
      select: { enviadaEm: true, necessidade: { select: { criadoEm: true } } },
    }),
  ]);

  const totalNec = necessidades.length;
  const preenchidas = necessidades.filter((n) => n.status === "PREENCHIDA").length;
  const ativas = necessidades.filter((n) => n.status === "ABERTA" || n.status === "EM_MATCH").length;
  // Fill rate sobre necessidades não canceladas.
  const baseFill = necessidades.filter((n) => n.status !== "CANCELADA").length;
  const fillRate = baseFill > 0 ? Math.round((preenchidas / baseFill) * 100) : null;

  const vazamento =
    propostasRecorrentes > 0
      ? Math.round((propostasVazadas / propostasRecorrentes) * 100)
      : null;

  // Tempo médio até a 1ª proposta (min), por necessidade.
  const primeiraPorNec = new Map<number, number>();
  for (const p of propostasEnviadas) {
    if (!p.enviadaEm) continue;
    const delta = (p.enviadaEm.getTime() - p.necessidade.criadoEm.getTime()) / 60000;
    const chave = p.necessidade.criadoEm.getTime();
    const atual = primeiraPorNec.get(chave);
    if (atual == null || delta < atual) primeiraPorNec.set(chave, delta);
  }
  const tempos = [...primeiraPorNec.values()];
  const tempoMedio =
    tempos.length > 0 ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Painel</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Os números que decidem o go/no-go da Fase 0 (CUI-29). Medidos desde a primeira
          contratação manual.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metrica
          titulo="Fill rate"
          valor={fillRate != null ? `${fillRate}%` : "—"}
          sub={`${preenchidas} de ${baseFill} necessidades`}
          nota="CUI-26 · termômetro da liquidez"
        />
        <Metrica
          titulo="Tempo até 1ª proposta"
          valor={tempoMedio != null ? `${tempoMedio} min` : "—"}
          sub="média"
          nota="CUI-26 · experiência que vende"
        />
        <Metrica
          titulo="Vazamento"
          valor={vazamento != null ? `${vazamento}%` : "—"}
          sub={`${propostasVazadas} de ${propostasRecorrentes} recorrentes`}
          nota="CUI-31 · o critério mais duro"
          alerta={vazamento != null && vazamento >= 50}
        />
        <Metrica
          titulo="Profissionais"
          valor={String(totalProf)}
          sub={`${profVerificados} com COREN verificado`}
          nota="Meta CUI-21: 30+"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ResumoLink href="/necessidades" titulo="Necessidades ativas" valor={ativas} total={totalNec} />
        <ResumoLink href="/necessidades" titulo="Preenchidas" valor={preenchidas} total={totalNec} />
        <ResumoLink href="/profissionais" titulo="Profissionais ativos" valor={totalProf} total={totalProf} />
      </div>

      {totalProf === 0 && totalNec === 0 && (
        <Cartao className="text-sm text-neutral-600">
          <p className="font-medium text-neutral-900">Por onde começar</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              Cadastre os primeiros profissionais da sua rede em{" "}
              <Link href="/profissionais/novo" className="underline">Profissionais → Novo</Link>.
            </li>
            <li>Verifique o COREN de cada um no SIGEN e registre.</li>
            <li>
              Quando uma família procurar, registre em{" "}
              <Link href="/necessidades/nova" className="underline">Necessidades → Nova</Link> e faça o match.
            </li>
          </ol>
        </Cartao>
      )}
    </div>
  );
}

function Metrica({
  titulo,
  valor,
  sub,
  nota,
  alerta,
}: {
  titulo: string;
  valor: string;
  sub: string;
  nota: string;
  alerta?: boolean;
}) {
  return (
    <Cartao className={alerta ? "border-red-200 bg-red-50" : ""}>
      <p className="text-sm text-neutral-500">{titulo}</p>
      <p className={`mt-1 text-3xl font-semibold tracking-tight ${alerta ? "text-red-700" : ""}`}>
        {valor}
      </p>
      <p className="text-xs text-neutral-500">{sub}</p>
      <p className="mt-2 text-[11px] text-neutral-400">{nota}</p>
    </Cartao>
  );
}

function ResumoLink({
  href,
  titulo,
  valor,
  total,
}: {
  href: string;
  titulo: string;
  valor: number;
  total: number;
}) {
  return (
    <Link href={href} className="block">
      <Cartao className="hover:border-neutral-300">
        <p className="text-sm text-neutral-500">{titulo}</p>
        <p className="mt-1 text-2xl font-semibold">
          {valor}
          <span className="text-base font-normal text-neutral-400"> / {total}</span>
        </p>
      </Cartao>
    </Link>
  );
}
