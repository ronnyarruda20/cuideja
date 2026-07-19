import { Campo, AreaTexto, Selecao, BotaoPrimario, Cartao } from "@/components/campos";
import { CATEGORIAS } from "@/lib/dominio";

type Prof = {
  nome: string;
  telefone: string;
  categoria: string;
  coren: string | null;
  especialidades: string | null;
  cidade: string;
  bairro: string | null;
  raioKm: number | null;
  valorDiurno: number | null;
  valorNoturno: number | null;
  valor24h: number | null;
  valorMensal: number | null;
  disponibilidade: string | null;
  prazoRecebimentoDias: number | null;
  observacoes: string | null;
};

export function FormProfissional({
  action,
  profissional,
  rotuloBotao,
}: {
  action: (formData: FormData) => void;
  profissional?: Prof;
  rotuloBotao: string;
}) {
  const p = profissional;
  return (
    <form action={action} className="space-y-6">
      <Cartao className="space-y-4">
        <h2 className="font-medium">Identificação</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nome" name="nome" required defaultValue={p?.nome} />
          <Campo label="WhatsApp" name="telefone" required defaultValue={p?.telefone} placeholder="(65) 9…" />
          <Selecao label="Categoria" name="categoria" opcoes={CATEGORIAS} required defaultValue={p?.categoria} />
          <Campo label="COREN" name="coren" defaultValue={p?.coren} dica="Número do registro. A verificação é feita depois." />
        </div>
      </Cartao>

      <Cartao className="space-y-4">
        <h2 className="font-medium">Atuação</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Cidade" name="cidade" required defaultValue={p?.cidade} placeholder="Cuiabá" />
          <Campo label="Bairro" name="bairro" defaultValue={p?.bairro} />
          <Campo label="Raio de atendimento (km)" name="raioKm" type="number" defaultValue={p?.raioKm} />
          <Campo label="Disponibilidade" name="disponibilidade" defaultValue={p?.disponibilidade} placeholder="noites, fins de semana" />
        </div>
        <Campo
          label="Especialidades (o que você faz melhor)"
          name="especialidades"
          defaultValue={p?.especialidades}
          dica="Separe por vírgula: idoso, pediatria, curativos, pós-operatório…"
        />
      </Cartao>

      <Cartao className="space-y-4">
        <h2 className="font-medium">Valores praticados (R$)</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <Campo label="Plantão diurno" name="valorDiurno" type="number" defaultValue={p?.valorDiurno} />
          <Campo label="Plantão noturno" name="valorNoturno" type="number" defaultValue={p?.valorNoturno} />
          <Campo label="24 horas" name="valor24h" type="number" defaultValue={p?.valor24h} />
          <Campo label="Mensal" name="valorMensal" type="number" defaultValue={p?.valorMensal} />
        </div>
        <Campo
          label="Prazo de recebimento hoje (dias)"
          name="prazoRecebimentoDias"
          type="number"
          defaultValue={p?.prazoRecebimentoDias}
          dica="Quanto tempo leva pra receber depois do plantão, no arranjo atual. Sinal do CUI-32."
        />
      </Cartao>

      <Cartao>
        <AreaTexto label="Observações" name="observacoes" defaultValue={p?.observacoes} />
      </Cartao>

      <BotaoPrimario>{rotuloBotao}</BotaoPrimario>
    </form>
  );
}
