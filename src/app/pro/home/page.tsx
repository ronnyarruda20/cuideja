import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirProfissional } from "@/lib/auth-pro";
import { sairPro } from "../actions";

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
    <div className="flex flex-col gap-6 pt-6">
      {/* Header com boas-vindas */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Bem-vindo, {prof.nome}! 👋
          </h1>
          {isNovo && (
            <p className="mt-2 text-sm text-emerald-600">
              ✓ Seu perfil foi criado com sucesso. Agora você pode receber propostas de trabalho.
            </p>
          )}
        </div>
        <form action={sairPro}>
          <button className="text-sm text-neutral-500 hover:text-neutral-700">Sair</button>
        </form>
      </div>

      {/* Grid de cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Status do Perfil */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
            Status do Perfil
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Categoria</span>
              <span className="font-medium text-neutral-900">{prof.categoria}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">COREN</span>
              <span className={`font-medium ${prof.corenVerificado ? "text-emerald-600" : "text-amber-600"}`}>
                {prof.corenVerificado ? "✓ Verificado" : prof.coren ? "Pendente" : "Não informado"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Cidade</span>
              <span className="font-medium text-neutral-900">{prof.cidade}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Especialidades</span>
              <span className="text-right text-sm font-medium text-neutral-900">
                {prof.especialidades ? `${prof.especialidades.split(",").length} áreas` : "Não informado"}
              </span>
            </div>
          </div>
          <Link
            href="/pro/conta"
            className="mt-4 block rounded-lg bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            Editar Perfil
          </Link>
        </div>

        {/* Propostas Ativas */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
            Propostas Ativas
          </h2>
          {prof.propostas.length > 0 ? (
            <div className="mt-4 space-y-2">
              <div className="text-3xl font-bold text-emerald-600">{prof.propostas.length}</div>
              <p className="text-sm text-neutral-600">
                {prof.propostas.length === 1 ? "proposta aguardando" : "propostas aguardando"}
              </p>
              <div className="mt-4 space-y-2 text-sm">
                {prof.propostas.map((prop) => (
                  <div key={prop.id} className="flex items-center justify-between text-neutral-700">
                    <span>#{prop.id.slice(0, 6)}</span>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {prop.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-neutral-600">
              Nenhuma proposta ativa no momento. Fique atento ao seu WhatsApp!
            </div>
          )}
        </div>

        {/* Valores Praticados */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
            Valores Praticados
          </h2>
          <div className="mt-4 space-y-2 text-sm">
            {prof.valorDiurno && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Plantão diurno</span>
                <span className="font-medium">R$ {prof.valorDiurno}</span>
              </div>
            )}
            {prof.valorNoturno && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Plantão noturno</span>
                <span className="font-medium">R$ {prof.valorNoturno}</span>
              </div>
            )}
            {prof.valor24h && (
              <div className="flex justify-between">
                <span className="text-neutral-600">24 horas</span>
                <span className="font-medium">R$ {prof.valor24h}</span>
              </div>
            )}
            {prof.valorMensal && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Mensal</span>
                <span className="font-medium">R$ {prof.valorMensal}</span>
              </div>
            )}
            {!prof.valorDiurno && !prof.valorNoturno && !prof.valor24h && !prof.valorMensal && (
              <p className="text-neutral-500">Valores não informados ainda.</p>
            )}
          </div>
        </div>

        {/* Disponibilidade */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
            Disponibilidade
          </h2>
          <div className="mt-4">
            {prof.disponibilidade ? (
              <p className="text-sm font-medium text-neutral-900">{prof.disponibilidade}</p>
            ) : (
              <p className="text-sm text-neutral-500">Não informado</p>
            )}
            {prof.raioKm && (
              <p className="mt-2 text-sm text-neutral-600">
                Raio de atendimento: <span className="font-medium">{prof.raioKm} km</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h3 className="text-sm font-semibold text-emerald-900">Próximos passos</h3>
        <p className="mt-2 text-sm text-emerald-800">
          Suas propostas chegam via WhatsApp. Mantenha seu perfil atualizado para aumentar suas chances.
        </p>
        <Link
          href="/pro/conta"
          className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700"
        >
          Atualizar Perfil
        </Link>
      </div>
    </div>
  );
}
