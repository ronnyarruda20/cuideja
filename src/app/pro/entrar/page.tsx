"use client";

import Link from "next/link";
import { useActionState } from "react";
import { entrar } from "../actions";

const input =
  "mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-base outline-none focus:border-emerald-600";

export default function EntrarPro() {
  const [erro, action, pending] = useActionState(entrar, null);

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Entrar</h1>
        <p className="mt-1 text-sm text-neutral-500">Acesse seu perfil de profissional.</p>
      </div>

      <form action={action} className="space-y-4">
        <label className="block text-sm font-medium text-neutral-700">
          Telefone (WhatsApp)
          <input name="telefone" type="tel" inputMode="tel" required className={input} placeholder="(65) 9…" />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Senha
          <input name="senha" type="password" required className={input} />
        </label>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Ainda não tem perfil?{" "}
        <Link href="/pro/cadastro" className="font-medium text-emerald-700 underline">
          Criar agora
        </Link>
      </p>
    </div>
  );
}
