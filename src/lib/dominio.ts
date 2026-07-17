// Valores válidos dos campos de "tipo". SQLite não tem enum no Prisma, então a
// validação vive aqui e as telas usam estas listas como fonte única de verdade.

export const CATEGORIAS = [
  { valor: "ENFERMEIRO", rotulo: "Enfermeiro(a)" },
  { valor: "TECNICO", rotulo: "Técnico(a) de enfermagem" },
  { valor: "AUXILIAR", rotulo: "Auxiliar de enfermagem" },
  { valor: "CUIDADOR", rotulo: "Cuidador(a)" },
] as const;

export const TAREFAS = [
  { valor: "companhia", rotulo: "Acompanhamento e companhia" },
  { valor: "higiene", rotulo: "Higiene e banho" },
  { valor: "medicacao", rotulo: "Administração de medicação" },
  { valor: "curativos", rotulo: "Curativos" },
  { valor: "pos-operatorio", rotulo: "Cuidados pós-operatórios" },
  { valor: "acompanhante-hospital", rotulo: "Acompanhante em hospital" },
] as const;

export const PERIODOS = [
  { valor: "DIURNO", rotulo: "Plantão diurno (12h)" },
  { valor: "NOTURNO", rotulo: "Plantão noturno (12h)" },
  { valor: "24H", rotulo: "24 horas" },
  { valor: "HORAS", rotulo: "Algumas horas por dia" },
] as const;

export const DURACOES = [
  { valor: "UM_DIA", rotulo: "Um dia só" },
  { valor: "ALGUNS_DIAS", rotulo: "Alguns dias" },
  { valor: "CONTINUO", rotulo: "Contínuo (semanas ou meses)" },
] as const;

export const URGENCIAS = [
  { valor: "HOJE", rotulo: "Para hoje ou amanhã" },
  { valor: "SEMANA", rotulo: "Nesta semana" },
  { valor: "DUAS_SEMANAS", rotulo: "Nas próximas duas semanas" },
  { valor: "PLANEJANDO", rotulo: "Só me planejando" },
] as const;

export const STATUS_NECESSIDADE = [
  { valor: "ABERTA", rotulo: "Aberta" },
  { valor: "EM_MATCH", rotulo: "Em match" },
  { valor: "PREENCHIDA", rotulo: "Preenchida" },
  { valor: "CANCELADA", rotulo: "Cancelada" },
] as const;

export const STATUS_PROPOSTA = [
  { valor: "SUGERIDO", rotulo: "Sugerido" },
  { valor: "ENVIADA", rotulo: "Proposta enviada" },
  { valor: "ACEITA", rotulo: "Aceita" },
  { valor: "RECUSADA", rotulo: "Recusada" },
  { valor: "EM_ANDAMENTO", rotulo: "Em andamento" },
  { valor: "CONCLUIDA", rotulo: "Concluída" },
  { valor: "CANCELADA", rotulo: "Cancelada" },
] as const;

// Helpers de exibição --------------------------------------------------------

function fazMapa(lista: ReadonlyArray<{ valor: string; rotulo: string }>) {
  return Object.fromEntries(lista.map((i) => [i.valor, i.rotulo]));
}

const MAPAS = {
  categoria: fazMapa(CATEGORIAS),
  tarefa: fazMapa(TAREFAS),
  periodo: fazMapa(PERIODOS),
  duracao: fazMapa(DURACOES),
  urgencia: fazMapa(URGENCIAS),
  statusNecessidade: fazMapa(STATUS_NECESSIDADE),
  statusProposta: fazMapa(STATUS_PROPOSTA),
} as const;

export function rotulo(tipo: keyof typeof MAPAS, valor: string | null | undefined): string {
  if (!valor) return "—";
  return MAPAS[tipo][valor] ?? valor;
}

export function rotulosDeLista(
  tipo: "tarefa",
  csv: string | null | undefined
): string {
  if (!csv) return "—";
  return csv
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => MAPAS[tipo][v] ?? v)
    .join(", ");
}

export function formatarReais(valor: number | null | undefined): string {
  if (valor == null) return "—";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}
