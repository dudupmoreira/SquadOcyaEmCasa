# Squad Ocyá em Casa

Esta é uma versão derivada do front-end principal do "Ocyá em Casa", adaptada exclusivamente para o **Squad de Influenciadores**.

A finalidade deste site é permitir que influenciadores montem seus kits personalizados (limitado a 6 itens) ou selecionem planos de assinatura, gerando conteúdo sem visualizar valores monetários (R$).

**Diferenças para a versão principal:**
- Sem menção a preços.
- Sem integração com plataforma de pagamento/e-commerce.
- Limite de 6 itens na montagem de kits avulsos.
- Sem verificação restrita de CEP de entrega.
- "Além da Mesa" desabilitado.
- Os pedidos são enviados via webhook para um script no Google Apps Script, que os adiciona em uma planilha do Google Sheets e envia um alerta por e-mail para a equipe do Ocyá, que ativa a assinatura manualmente.

## Estrutura do Pedido (Webhook)

O envio do pedido no checkout está conectado a uma variável de ambiente:
`NEXT_PUBLIC_GOOGLE_SCRIPT_URL`

Ao finalizar, o site realiza um POST assíncrono (`no-cors`) para essa URL.

> ⚠️ **Atenção:** Ao configurar essa variável na Vercel, cole **apenas a URL** — sem o prefixo `NEXT_PUBLIC_GOOGLE_SCRIPT_URL=`. Colar a linha inteira do `.env.local` é um erro comum que faz o webhook falhar silenciosamente.

Para saber como configurar ou modificar o script da planilha que recebe esses dados, consulte:
👉 [GUIA_APPS_SCRIPT.md](./GUIA_APPS_SCRIPT.md)

## Links e Hospedagem

- **Domínio:** https://squad.ocyaemcasa.com.br
- **Hospedagem:** Vercel (Projeto `squad-ocya-em-casa`)
- **Repositório:** GitHub (`dudupmoreira/SquadOcyaEmCasa`)
- **Deploy:** Automático via push para `main`

## Como rodar localmente

Instale as dependências:
```bash
npm install
```

Crie o arquivo `.env.local` na raiz com base no `.env.local.example`:
```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
```

> O valor deve ser **somente a URL**, sem o nome da variável.

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Build e deploy manual

```bash
npm run build       # valida o build antes do push
git push            # dispara deploy automático na Vercel
```

Se precisar forçar um redeploy sem alteração de código (ex: após mudar env vars):
```bash
vercel --prod --yes
```
