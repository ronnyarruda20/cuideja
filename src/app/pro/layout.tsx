import Link from "next/link";

// Layout da área do profissional: mobile-first, container estreito, sem a
// navegação do operador. Abre pelo link compartilhado no WhatsApp.
export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col bg-white">
      <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
        <Link href="/pro" className="text-lg font-semibold tracking-tight text-emerald-700">
          CuidaJá
        </Link>
        <span className="text-xs text-neutral-400">para profissionais</span>
      </header>
      <div className="flex-1 px-5 py-6">{children}</div>
    </div>
  );
}
