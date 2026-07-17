# Publicar no Railway

O código já está pronto para produção (Postgres, migração inicial, scripts de
deploy). Falta a parte que só você faz: criar a conta e o projeto no Railway.

Siga os passos. Onde disser **⏸ me avise**, para e me chama que eu continuo.

---

## 1. Criar conta e projeto

1. Acesse **railway.app** e crie a conta (pode entrar com Google).
2. **New Project** → **Deploy from GitHub repo** (recomendado) ou **Empty Project**.
   - Se escolher GitHub: você precisa subir este código para um repositório
     primeiro. Me avise que eu te passo os comandos de `git`.
   - Se preferir sem GitHub: **Empty Project** e usaremos a CLI do Railway.

## 2. Adicionar o banco Postgres

1. Dentro do projeto: **+ New** → **Database** → **Add PostgreSQL**.
2. O Railway cria o banco e uma variável `DATABASE_URL` automaticamente.

## 3. Configurar as variáveis de ambiente do app

No serviço do **app** (não no banco), aba **Variables**, adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (referência ao banco) |
| `APP_PASSWORD` | uma **senha forte** sua (não use "cuidaja") |
| `APP_SESSION_SECRET` | `2b054cadf9c145837e1dd2040155f48484b17f9ecb9d9273c3858a430ece9eb3` |

> O `APP_SESSION_SECRET` acima foi gerado só para você. Se quiser outro, rode:
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 4. Deploy

- **Via GitHub:** o Railway faz o deploy sozinho a cada push.
- **Via CLI:** rode `railway up` na pasta `plataforma` (me chama que eu ajudo).

No deploy, o `start` roda `prisma migrate deploy` automaticamente — o banco é
criado com as tabelas certas na primeira subida. Você não faz nada manual aqui.

## 5. Testar

1. Abra a URL pública que o Railway gerar.
2. `/pro` → cadastro do profissional (a página que vai no grupo do WhatsApp).
3. `/login` → seu painel de operador (a senha é a `APP_PASSWORD` que você definiu).

---

## ⚠️ Antes de divulgar de verdade

- **LGPD (CUI-10):** a partir daqui você coleta CPF/COREN de gente real. Política
  de privacidade e consentimento deixam de ser "depois".
- **Plano do Railway:** começa com crédito grátis; depois é pago por uso
  (~US$5/mês para este tamanho).
- **Backup:** o Railway tem backup do Postgres, mas confirme que está ligado
  antes de ter dados reais dentro.
