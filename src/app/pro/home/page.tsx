import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirProfissional } from "@/lib/auth-pro";

export default async function HomePro({ searchParams }: { searchParams: Promise<{ novo?: string }> }) {
  const profId = await exigirProfissional();
  const params = await searchParams;
  const isNovo = params.novo === "1";

  const prof = await prisma.profissional.findUnique({
    where: { id: profId },
    include: {
      propostas: {
        where: { status: { in: ["ENVIADA", "ACEITA", "EM_ANDAMENTO"] } },
        take: 5,
        orderBy: { criadoEm: "desc" },
      },
    },
  });

  if (!prof) {
    return <div>Profissional não encontrado.</div>;
  }

  return (
    <div className="space-y-6 pt-6 pb-10">
      <section className="rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-500 p-6 text-white shadow-[0_30px_80px_-40px_rgba(16,185,129,0.6)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100/90">Propostas Ativas</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight">{prof.propostas.length}</p>
            <p className="mt-2 max-w-xl text-sm text-emerald-100/85">
              Aqui estão as oportunidades atuais que estão esperando sua resposta. Fique atento ao WhatsApp para não perder nenhum plantão.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-white/15 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20">
            {prof.propostas.length > 0 ? "Você tem propostas pendentes" : "Nenhuma proposta ativa"}
          </div>
        </div>

        {prof.propostas.length > 0 ? (
          <div className="mt-6 grid gap-3">
            {prof.propostas.map((prop) => (
              <div key={prop.id} className="rounded-[1.75rem] bg-white/15 p-4 ring-1 ring-white/10 transition hover:bg-white/25">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Proposta #{prop.id.slice(0, 6)}</p>
                    <p className="mt-1 text-xs text-emerald-100/80">
                      Recebida em {new Date(prop.criadoEm).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-black/5">
                    {prop.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.75rem] bg-white/10 p-6 text-sm text-emerald-100/85">
            Ainda não há propostas ativas. Continue disponível e atualize seu perfil para aparecer nas sugestões.
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.55fr_0.95fr]">
        <section className="rounded-[2rem] bg-emerald-600 p-6 text-white shadow-[0_20px_60px_-30px_rgba(16,185,129,0.7)]">
          <div className="grid gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-tight">Olá, {prof.nome.split(" ")[0]}</h1>
                <p className="mt-2 max-w-xl text-sm text-emerald-100/90">
                  Seu perfil está pronto. Mantenha as informações atualizadas para receber mais propostas.
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-lg font-semibold text-white">
                {prof.nome[0].toUpperCase()}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-4 text-sm">
                <p className="uppercase tracking-[0.2em] text-emerald-100/70">Perfil</p>
                <p className="mt-2 font-semibold text-white">{prof.categoria}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 text-sm">
                <p className="uppercase tracking-[0.2em] text-emerald-100/70">Cidade</p>
                <p className="mt-2 font-semibold text-white">{prof.cidade}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 text-sm">
                <p className="uppercase tracking-[0.2em] text-emerald-100/70">Especialidades</p>
                <p className="mt-2 font-semibold text-white">{prof.especialidades ? prof.especialidades.split(",").length : 0}</p>
              </div>
            </div>
          </div>
        </section>

   
      </div>

      <div className="space-y-5">
        <section className="rounded-[2rem] bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.2)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-700">Valores</p>
          <div className="mt-4 grid gap-3">
            {prof.valorDiurno ? (
              <div className="rounded-3xl bg-stone-950/5 p-4">
                <p className="text-xs text-neutral-500">Diurno</p>
                <p className="mt-2 text-lg font-semibold text-neutral-900">R$ {prof.valorDiurno}</p>
              </div>
            ) : null}
            {prof.valorNoturno ? (
              <div className="rounded-3xl bg-stone-950/5 p-4">
                <p className="text-xs text-neutral-500">Noturno</p>
                <p className="mt-2 text-lg font-semibold text-neutral-900">R$ {prof.valorNoturno}</p>
              </div>
            ) : null}
            {prof.valor24h ? (
              <div className="rounded-3xl bg-stone-950/5 p-4">
                <p className="text-xs text-neutral-500">24h</p>
                <p className="mt-2 text-lg font-semibold text-neutral-900">R$ {prof.valor24h}</p>
              </div>
            ) : null}
            {prof.valorMensal ? (
              <div className="rounded-3xl bg-stone-950/5 p-4">
                <p className="text-xs text-neutral-500">Mensal</p>
                <p className="mt-2 text-lg font-semibold text-neutral-900">R$ {prof.valorMensal}</p>
              </div>
            ) : null}
            {!prof.valorDiurno && !prof.valorNoturno && !prof.valor24h && !prof.valorMensal && (
              <div className="rounded-3xl bg-stone-50 p-4 text-sm text-neutral-500">Valores não informados ainda.</div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] bg-emerald-50 p-5 text-neutral-900 shadow-[0_20px_60px_-30px_rgba(16,185,129,0.25)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">Próximo passo</p>
          <p className="mt-3 text-sm leading-6 text-emerald-900/90">
            Mantenha seus dados atualizados e fique disponível para receber novas propostas por WhatsApp.
          </p>
          <Link
            href="/pro/conta"
            className="mt-5 inline-flex w-full items-center justify-center rounded-3xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Atualizar Perfil
          </Link>
        </section>
      </div>
    </div>
  );
}
