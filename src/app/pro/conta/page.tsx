import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirProfissional } from "@/lib/auth-pro";
import { rotulo, formatarReais } from "@/lib/dominio";
import { atualizarMeuPerfil, sairPro } from "../actions";

const input =
  "mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-base outline-none focus:border-emerald-600";
const label = "block text-sm font-medium text-neutral-700";

export default async function MinhaConta({
  searchParams,
}: {
  searchParams: Promise<{ novo?: string }>;
}) {
  const id = await exigirProfissional();
  const { novo } = await searchParams;
  const p = await prisma.profissional.findUnique({ where: { id } });
  if (!p) notFound();

  return (
    <div className="flex flex-col gap-6 pt-2">
      {novo && (
        <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-medium">Perfil criado! 🎉</p>
          <p className="mt-1">
            Vamos confirmar seu COREN e te avisar por WhatsApp quando surgir um plantão que combina.
          </p>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Olá, {p.nome.split(" ")[0]}</h1>
          <p className="text-sm text-neutral-500">{rotulo("categoria", p.categoria)} · {p.cidade}</p>
        </div>
        <form action={sairPro}>
          <button className="text-sm text-neutral-400 hover:text-neutral-700">Sair</button>
        </form>
      </div>

      {/* Status de verificação */}
      <div
        className={`rounded-xl border p-4 text-sm ${
          p.corenVerificado
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-amber-200 bg-amber-50 text-amber-800"
        }`}
      >
        {p.corenVerificado ? (
          <p><b>✓ COREN verificado.</b> Seu perfil tem o selo de confiança.</p>
        ) : (
          <p><b>COREN em verificação.</b> Assim que confirmarmos, seu perfil ganha o selo.</p>
        )}
      </div>

      {/* Editar disponibilidade e valores */}
      <form action={atualizarMeuPerfil} className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Meu perfil</h2>

        <label className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 text-sm">
          <input type="checkbox" name="ativo" defaultChecked={p.ativo} className="size-5 accent-emerald-600" />
          <span>
            <b>Disponível para plantões</b>
            <span className="block text-neutral-500">Desmarque se não quiser receber oportunidades agora.</span>
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className={label}>
            Cidade
            <input name="cidade" required defaultValue={p.cidade} className={input} />
          </label>
          <label className={label}>
            Bairro
            <input name="bairro" defaultValue={p.bairro ?? ""} className={input} />
          </label>
        </div>
        <label className={label}>
          Especialidades
          <input name="especialidades" defaultValue={p.especialidades ?? ""} className={input} />
        </label>
        <label className={label}>
          Disponibilidade
          <input name="disponibilidade" defaultValue={p.disponibilidade ?? ""} className={input} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={label}>
            Diurno (R$)
            <input name="valorDiurno" type="number" inputMode="numeric" defaultValue={p.valorDiurno ?? ""} className={input} />
          </label>
          <label className={label}>
            Noturno (R$)
            <input name="valorNoturno" type="number" inputMode="numeric" defaultValue={p.valorNoturno ?? ""} className={input} />
          </label>
          <label className={label}>
            24h (R$)
            <input name="valor24h" type="number" inputMode="numeric" defaultValue={p.valor24h ?? ""} className={input} />
          </label>
          <label className={label}>
            Mensal (R$)
            <input name="valorMensal" type="number" inputMode="numeric" defaultValue={p.valorMensal ?? ""} className={input} />
          </label>
        </div>

        <button className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 font-medium text-white hover:bg-emerald-500">
          Salvar
        </button>
      </form>

      <p className="text-center text-xs text-neutral-400">
        Hoje: {p.valorNoturno ? `plantão noturno ${formatarReais(p.valorNoturno)}` : "valores não informados"}
      </p>
    </div>
  );
}
