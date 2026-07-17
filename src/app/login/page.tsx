"use client";

import { useActionState } from "react";
import { entrar } from "./actions";

export default function LoginPage() {
  const [erro, action, pending] = useActionState(entrar, null);

  return (
    <main className="flex-1 grid place-items-center p-6">
      <form
        action={action}
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold tracking-tight">CuidaJá</h1>
        <p className="mt-1 text-sm text-neutral-500">Painel do operador</p>

        <label className="mt-6 block text-sm font-medium text-neutral-700">
          Senha
          <input
            name="senha"
            type="password"
            autoFocus
            required
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          />
        </label>

        {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-neutral-900 px-4 py-2.5 font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
