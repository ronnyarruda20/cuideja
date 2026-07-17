import Link from "next/link";
import { exigirLogin } from "@/lib/auth";
import { sair } from "./actions";

const LINKS = [
  { href: "/", rotulo: "Painel" },
  { href: "/necessidades", rotulo: "Necessidades" },
  { href: "/profissionais", rotulo: "Profissionais" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirLogin();

  return (
    <>
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
          <Link href="/" className="font-semibold tracking-tight">
            CuidaJá
          </Link>
          <nav className="flex gap-4 text-sm text-neutral-600">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-neutral-900">
                {l.rotulo}
              </Link>
            ))}
          </nav>
          <form action={sair} className="ml-auto">
            <button className="text-sm text-neutral-500 hover:text-neutral-900">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
    </>
  );
}
