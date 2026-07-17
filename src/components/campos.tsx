// Componentes de formulário reutilizáveis. Sem interatividade — server components.

import type { ReactNode } from "react";

const baseInput =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

export function Campo({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
  dica,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number | null;
  placeholder?: string;
  dica?: string;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label} {required && <span className="text-red-500">*</span>}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? undefined}
        placeholder={placeholder}
        className={baseInput}
      />
      {dica && <span className="mt-1 block text-xs font-normal text-neutral-400">{dica}</span>}
    </label>
  );
}

export function AreaTexto({
  label,
  name,
  defaultValue,
  placeholder,
  dica,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  dica?: string;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      <textarea
        name={name}
        rows={3}
        defaultValue={defaultValue ?? undefined}
        placeholder={placeholder}
        className={baseInput}
      />
      {dica && <span className="mt-1 block text-xs font-normal text-neutral-400">{dica}</span>}
    </label>
  );
}

export function Selecao({
  label,
  name,
  opcoes,
  defaultValue,
  required,
  vazio = "—",
}: {
  label: string;
  name: string;
  opcoes: ReadonlyArray<{ valor: string; rotulo: string }>;
  defaultValue?: string | null;
  required?: boolean;
  vazio?: string;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label} {required && <span className="text-red-500">*</span>}
      <select
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className={baseInput}
      >
        <option value="">{vazio}</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkboxes({
  label,
  name,
  opcoes,
  marcados,
}: {
  label: string;
  name: string;
  opcoes: ReadonlyArray<{ valor: string; rotulo: string }>;
  marcados?: string[];
}) {
  return (
    <fieldset className="text-sm">
      <legend className="font-medium text-neutral-700">{label}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {opcoes.map((o) => (
          <label key={o.valor} className="flex items-center gap-2 font-normal text-neutral-600">
            <input
              type="checkbox"
              name={name}
              value={o.valor}
              defaultChecked={marcados?.includes(o.valor)}
              className="size-4 rounded border-neutral-300"
            />
            {o.rotulo}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Cartao({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function BotaoPrimario({ children }: { children: ReactNode }) {
  return (
    <button className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">
      {children}
    </button>
  );
}
