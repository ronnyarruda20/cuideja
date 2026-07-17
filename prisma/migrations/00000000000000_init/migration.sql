-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Profissional" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "coren" TEXT,
    "corenVerificado" BOOLEAN NOT NULL DEFAULT false,
    "corenVerificadoEm" TIMESTAMP(3),
    "corenVerificadoPor" TEXT,
    "especialidades" TEXT,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT,
    "raioKm" INTEGER,
    "valorDiurno" INTEGER,
    "valorNoturno" INTEGER,
    "valor24h" INTEGER,
    "valorMensal" INTEGER,
    "disponibilidade" TEXT,
    "senhaHash" TEXT,
    "autocadastro" BOOLEAN NOT NULL DEFAULT false,
    "prazoRecebimentoDias" INTEGER,
    "comoConsegueTrabalho" TEXT,
    "plantoesUltimoMes" INTEGER,
    "jaLevouCalote" BOOLEAN,
    "jaPagouPorLead" BOOLEAN,
    "comissaoAceita" INTEGER,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profissional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Necessidade" (
    "id" TEXT NOT NULL,
    "familiaNome" TEXT NOT NULL,
    "familiaTelefone" TEXT NOT NULL,
    "pacienteRelacao" TEXT,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT,
    "tarefas" TEXT,
    "periodo" TEXT,
    "dataInicio" TIMESTAMP(3),
    "duracao" TEXT,
    "urgencia" TEXT,
    "orcamentoEsperado" INTEGER,
    "canal" TEXT,
    "pagaAntecipado" BOOLEAN,
    "status" TEXT NOT NULL DEFAULT 'ABERTA',
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Necessidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposta" (
    "id" TEXT NOT NULL,
    "necessidadeId" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUGERIDO',
    "valorCombinado" INTEGER,
    "enviadaEm" TIMESTAMP(3),
    "aceitaEm" TIMESTAMP(3),
    "concluidaEm" TIMESTAMP(3),
    "recorrente" BOOLEAN NOT NULL DEFAULT false,
    "vazou" BOOLEAN NOT NULL DEFAULT false,
    "vazouMotivo" TEXT,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "propostaId" TEXT NOT NULL,
    "de" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profissional_telefone_key" ON "Profissional"("telefone");

-- AddForeignKey
ALTER TABLE "Proposta" ADD CONSTRAINT "Proposta_necessidadeId_fkey" FOREIGN KEY ("necessidadeId") REFERENCES "Necessidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposta" ADD CONSTRAINT "Proposta_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_propostaId_fkey" FOREIGN KEY ("propostaId") REFERENCES "Proposta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
