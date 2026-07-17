import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirLogin } from "@/lib/auth";
import { rotulo, formatarReais } from "@/lib/dominio";

export default async function ListaProfissionais() {
  await exigirLogin();
  const profissionais = await prisma.profissional.findMany({
    orderBy: [{ ativo: "desc" }, { criadoEm: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Profissionais</h1>
        <Link
          href="/profissionais/novo"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Novo
        </Link>
      </div>

      {profissionais.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
          Nenhum profissional ainda. Comece cadastrando os primeiros da sua rede.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Cidade</th>
                <th className="px-4 py-3 font-medium">COREN</th>
                <th className="px-4 py-3 font-medium">Noturno</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {profissionais.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/profissionais/${p.id}`} className="font-medium text-neutral-900 hover:underline">
                      {p.nome}
                    </Link>
                    {p.autocadastro && (
                      <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        autocadastro
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{rotulo("categoria", p.categoria)}</td>
                  <td className="px-4 py-3 text-neutral-600">{p.cidade}</td>
                  <td className="px-4 py-3">
                    {p.corenVerificado ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Verificado
                      </span>
                    ) : p.coren ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        A verificar
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">sem registro</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{formatarReais(p.valorNoturno)}</td>
                  <td className="px-4 py-3">
                    {p.ativo ? (
                      <span className="text-xs text-neutral-500">ativo</span>
                    ) : (
                      <span className="text-xs text-neutral-400">inativo</span>
                    )}
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
