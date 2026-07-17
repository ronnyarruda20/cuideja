import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirLogin } from "@/lib/auth";
import { rotulo } from "@/lib/dominio";

const CORES_STATUS: Record<string, string> = {
  ABERTA: "bg-blue-50 text-blue-700",
  EM_MATCH: "bg-amber-50 text-amber-700",
  PREENCHIDA: "bg-emerald-50 text-emerald-700",
  CANCELADA: "bg-neutral-100 text-neutral-500",
};

export default async function ListaNecessidades() {
  await exigirLogin();
  const necessidades = await prisma.necessidade.findMany({
    orderBy: { criadoEm: "desc" },
    include: { _count: { select: { propostas: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Necessidades</h1>
        <Link
          href="/necessidades/nova"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Nova
        </Link>
      </div>

      {necessidades.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
          Nenhuma necessidade ainda. Registre a primeira quando uma família procurar.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Família</th>
                <th className="px-4 py-3 font-medium">Cidade</th>
                <th className="px-4 py-3 font-medium">Urgência</th>
                <th className="px-4 py-3 font-medium">Propostas</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {necessidades.map((n) => (
                <tr key={n.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/necessidades/${n.id}`} className="font-medium text-neutral-900 hover:underline">
                      {n.familiaNome}
                    </Link>
                    {n.pacienteRelacao && (
                      <span className="ml-1 text-xs text-neutral-400">({n.pacienteRelacao})</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{n.cidade}</td>
                  <td className="px-4 py-3 text-neutral-600">{rotulo("urgencia", n.urgencia)}</td>
                  <td className="px-4 py-3 text-neutral-600">{n._count.propostas}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CORES_STATUS[n.status] ?? ""}`}>
                      {rotulo("statusNecessidade", n.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
