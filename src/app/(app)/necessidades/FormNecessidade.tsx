import { Campo, AreaTexto, Selecao, Checkboxes, BotaoPrimario, Cartao } from "@/components/campos";
import { TAREFAS, PERIODOS, DURACOES, URGENCIAS } from "@/lib/dominio";

const SIM_NAO = [
  { valor: "sim", rotulo: "Sim" },
  { valor: "nao", rotulo: "Não" },
];

export function FormNecessidade({
  action,
}: {
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-6">
      <Cartao className="space-y-4">
        <h2 className="font-medium">Família</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nome de quem procura" name="familiaNome" required />
          <Campo label="WhatsApp" name="familiaTelefone" required placeholder="(65) 9…" />
          <Campo label="O cuidado é para quem?" name="pacienteRelacao" placeholder="mãe, pai, cônjuge, para mim…" />
          <Campo label="Como chegou até você?" name="canal" placeholder="indicação, Instagram, clínica…" dica="Alimenta o CUI-19 (CAC por canal)." />
        </div>
      </Cartao>

      <Cartao className="space-y-4">
        <h2 className="font-medium">O que precisa</h2>
        <Checkboxes
          label="Do que a pessoa vai precisar?"
          name="tarefas"
          opcoes={TAREFAS}
        />
        <p className="text-xs text-neutral-400">
          Tarefas, não diagnóstico. Não registre doença nem histórico médico (LGPD, CUI-10).
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Cidade" name="cidade" required placeholder="Cuiabá" />
          <Campo label="Bairro" name="bairro" />
          <Selecao label="Período" name="periodo" opcoes={PERIODOS} />
          <Campo label="Quando começa?" name="dataInicio" type="date" />
          <Selecao label="Por quanto tempo?" name="duracao" opcoes={DURACOES} />
          <Selecao label="Urgência" name="urgencia" opcoes={URGENCIAS} />
        </div>
      </Cartao>

      <Cartao className="space-y-4">
        <h2 className="font-medium">Dinheiro</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Orçamento esperado (R$)" name="orcamentoEsperado" type="number" dica="Por plantão ou por mês, anote no campo de observações qual." />
          <Selecao
            label="Toparia pagar antes do plantão?"
            name="pagaAntecipado"
            opcoes={SIM_NAO}
            vazio="Não perguntado"
          />
        </div>
        <p className="text-xs text-neutral-400">
          A pergunta do pré-pagamento é a hipótese central do CUI-32. Pergunte quando fizer sentido.
        </p>
      </Cartao>

      <Cartao>
        <AreaTexto label="Observações" name="observacoes" />
      </Cartao>

      <BotaoPrimario>Registrar necessidade</BotaoPrimario>
    </form>
  );
}
