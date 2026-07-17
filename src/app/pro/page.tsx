import Link from "next/link";

// Landing do profissional. Mobile-first. O foco é a promessa que veio das
// conversas: receber no dia (CUI-32), não "mais clientes".
export default function ProLanding() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3 pt-4">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900">
          Plantões com pagamento no dia.
        </h1>
        <p className="text-neutral-600">
          Cadastre seu perfil, tenha seu COREN verificado e receba oportunidades de plantão
          particular perto de você — sem depender de grupo de WhatsApp.
        </p>
      </div>

      <ul className="space-y-3 text-sm">
        {[
          ["💰", "Receba no dia do plantão", "Sem esperar semanas pra cair na conta."],
          ["🛡️", "Perfil verificado", "Seu COREN confirmado vira um selo de confiança."],
          ["📍", "Oportunidades perto de você", "Só o que combina com sua cidade e disponibilidade."],
          ["🤝", "Sem pagar por lead", "Você nunca paga pra ver um contato. Só ganhamos quando você ganha."],
        ].map(([emoji, titulo, sub]) => (
          <li key={titulo} className="flex gap-3 rounded-xl border border-neutral-200 p-3">
            <span className="text-xl" aria-hidden>{emoji}</span>
            <div>
              <p className="font-medium text-neutral-900">{titulo}</p>
              <p className="text-neutral-500">{sub}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        <Link
          href="/pro/cadastro"
          className="block rounded-xl bg-emerald-600 px-5 py-3.5 text-center font-medium text-white hover:bg-emerald-500"
        >
          Criar meu perfil
        </Link>
        <p className="text-center text-sm text-neutral-500">
          Já tem conta?{" "}
          <Link href="/pro/entrar" className="font-medium text-emerald-700 underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
