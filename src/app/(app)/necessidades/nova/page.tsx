import Link from "next/link";
import { FormNecessidade } from "../FormNecessidade";
import { criarNecessidade } from "../actions";

export default function NovaNecessidade() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/necessidades" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Necessidades
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Nova necessidade</h1>
      </div>
      <FormNecessidade action={criarNecessidade} />
    </div>
  );
}
