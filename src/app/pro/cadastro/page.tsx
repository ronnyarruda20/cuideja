"use client";

import Link from "next/link";
import { useActionState } from "react";
import { cadastrar } from "../actions";
import { CATEGORIAS } from "@/lib/dominio";

const input =
  "mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-base outline-none focus:border-emerald-600";
const label = "block text-sm font-medium text-neutral-700";

function SimNao({ name }: { name: string }) {
  return (
    <div className="mt-1 flex gap-2">
      {[
        ["sim", "Sim"],
        ["nao", "Não"],
      ].map(([v, r]) => (
        <label
          key={v}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50"
        >
          <input type="radio" name={name} value={v} className="accent-emerald-600" />
          {r}
        </label>
      ))}
    </div>
  );
}

export default function CadastroPro() {
  const [erro, action, pending] = useActionState(cadastrar, null);

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Criar meu perfil</h1>
        <p className="mt-1 text-sm text-neutral-500">Leva uns 3 minutos. É de graça.</p>
      </div>

      <form action={action} className="space-y-8">
        {/* Conta */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Sua conta</h2>
          <label className={label}>
            Nome completo
            <input name="nome" required className={input} />
          </label>
          <label className={label}>
            Telefone (WhatsApp)
            <input name="telefone" type="tel" inputMode="tel" required className={input} placeholder="(65) 9…" />
            <span className="mt-1 block text-xs font-normal text-neutral-400">
              É com ele que você entra depois.
            </span>
          </label>
          <label className={label}>
            Criar senha
            <input name="senha" type="password" required minLength={6} className={input} placeholder="mínimo 6 caracteres" />
          </label>
        </section>

        {/* Perfil */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Seu perfil</h2>
          <label className={label}>
            Você é
            <select name="categoria" required defaultValue="" className={input}>
              <option value="" disabled>Selecione…</option>
              {CATEGORIAS.map((c) => (
                <option key={c.valor} value={c.valor}>{c.rotulo}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            Número do COREN
            <input name="coren" className={input} />
            <span className="mt-1 block text-xs font-normal text-neutral-400">
              A gente confirma no conselho e seu perfil ganha o selo de verificado.
            </span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={label}>
              Cidade
              <input name="cidade" required className={input} placeholder="Cuiabá" />
            </label>
            <label className={label}>
              Bairro
              <input name="bairro" className={input} />
            </label>
          </div>
          <label className={label}>
            Especialidades
            <input name="especialidades" className={input} placeholder="idoso, curativos, pós-operatório…" />
            <span className="mt-1 block text-xs font-normal text-neutral-400">
              Quando uma família procura cuidado, ela busca profissionais com experiência específica. Informar suas especialidades aumenta as chances de você ser sugerido para o trabalho ideal.
            </span>
          </label>
          <label className={label}>
            Disponibilidade
            <input name="disponibilidade" className={input} placeholder="noites, fins de semana…" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={label}>
              Plantão diurno (R$)
              <input name="valorDiurno" type="number" inputMode="numeric" className={input} />
            </label>
            <label className={label}>
              Plantão noturno (R$)
              <input name="valorNoturno" type="number" inputMode="numeric" className={input} />
            </label>
            <label className={label}>
              24 horas (R$)
              <input name="valor24h" type="number" inputMode="numeric" className={input} />
            </label>
            <label className={label}>
              Mensal (R$)
              <input name="valorMensal" type="number" inputMode="numeric" className={input} />
            </label>
          </div>
        </section>

        {/* Experiência — entrevista estruturada */}
        <section className="space-y-4 rounded-2xl bg-neutral-50 p-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Como é seu trabalho hoje</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Isso nos ajuda a te atender melhor. Pode pular o que não quiser responder.
            </p>
          </div>
          <label className={label}>
            Como você consegue plantões hoje?
            <input name="comoConsegueTrabalho" className={input} placeholder="grupos de WhatsApp, indicação…" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={label}>
              Plantões no último mês
              <input name="plantoesUltimoMes" type="number" inputMode="numeric" className={input} />
            </label>
            <label className={label}>
              Dias pra receber hoje
              <input name="prazoRecebimentoDias" type="number" inputMode="numeric" className={input} placeholder="ex: 15" />
            </label>
          </div>
          <div>
            <span className={label}>Já trabalhou e não recebeu (calote)?</span>
            <SimNao name="jaLevouCalote" />
          </div>
          <div>
            <span className={label}>Já pagou pra conseguir trabalho (app, anúncio)?</span>
            <SimNao name="jaPagouPorLead" />
          </div>
          <label className={label}>
            Que % de comissão você acharia justo?
            <input name="comissaoAceita" type="number" inputMode="numeric" className={input} placeholder="ex: 15" />
          </label>
        </section>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-emerald-600 px-5 py-4 text-base font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {pending ? "Criando…" : "Criar meu perfil"}
        </button>

        <p className="text-center text-xs text-neutral-400">
          Ao criar, você concorda que a gente confirme seu COREN e entre em contato por WhatsApp.
        </p>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Já tem conta?{" "}
        <Link href="/pro/entrar" className="font-medium text-emerald-700 underline">Entrar</Link>
      </p>
    </div>
  );
}
