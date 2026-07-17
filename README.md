# CuidaJá — Painel do operador (Fatia 1)

Ferramenta interna de concierge. **Não** é o app público — é onde você (operador)
cadastra profissionais, registra necessidades das famílias, faz o match na mão e
acompanha os números que decidem o go/no-go da Fase 0.

## O que ela faz

- **Profissionais** — cadastro com categoria, especialidades, valores, e registro
  da verificação manual de COREN (quem verificou e quando — CUI-12).
- **Necessidades** — o que a família precisa (tarefas, não diagnóstico), local,
  período, urgência, orçamento e como chegou até você.
- **Match** — sugere profissionais compatíveis (mesma cidade primeiro), gera
  propostas e acompanha o funil: sugerido → enviada → aceita → em andamento →
  concluída.
- **Painel** — fill rate, tempo até a 1ª proposta e taxa de vazamento (CUI-31),
  calculados automaticamente a partir do que você registra.

## Rodar localmente

```bash
npm run dev
```

Abre em http://localhost:3000. A senha do operador está no arquivo `.env`
(`APP_PASSWORD`). **Troque antes de usar de verdade.**

## Segurança e dados (importante)

- O banco (`dev.db`) guarda **dados sensíveis** (COREN, telefone, tarefas de
  cuidado). Ele está no `.gitignore` e **nunca** deve ir para o git nem para a
  nuvem sem criptografia.
- A ferramenta é protegida por uma senha única (a sua). Não é sistema de contas.
- Não registre diagnóstico nem histórico médico — só tarefas (LGPD, CUI-10).

## Stack

Next.js 16 · React 19 · Prisma 7 (SQLite via driver adapter) · Tailwind v4.

Quando a Fatia 2 (público + pagamento) chegar, a migração para Postgres/Supabase
é direta — a modelagem já é a do produto final.

## Comandos úteis

```bash
npm run dev            # desenvolvimento
npm run build          # build de produção
npx prisma studio      # inspecionar o banco visualmente
npx prisma migrate dev # aplicar mudanças no schema
```
