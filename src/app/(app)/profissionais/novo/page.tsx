import Link from "next/link";
import { FormProfissional } from "../FormProfissional";
import { criarProfissional } from "../actions";

export default function NovoProfissional() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/profissionais" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Profissionais
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Novo profissional</h1>
      </div>
      <FormProfissional action={criarProfissional} rotuloBotao="Cadastrar" />
    </div>
  );
}
