# Guia de Configuração: Google Apps Script (Squad Ocyá)

Este documento contém o script necessário para receber os pedidos dos influenciadores, salvar em uma planilha e enviar por e-mail automaticamente.

---

## 1. Criar a Planilha

1. Acesse [Google Sheets](https://sheets.google.com/) logado em uma conta do Ocyá (ex: suporte@ocya.com.br).
2. Crie uma nova planilha em branco e nomeie-a como **"Pedidos - Squad Ocyá"**.
3. Na primeira linha (Cabeçalho), coloque as seguintes colunas de A a H:
   - Data/Hora
   - Nome
   - E-mail
   - Telefone
   - CEP
   - Tipo de Pedido (Assinatura / Avulso)
   - Resumo do Pedido (Plano/Itens)
   - Valor Estimado

## 2. Inserir o Código (Apps Script)

1. No menu superior da planilha, clique em **Extensões > Apps Script**.
2. Apague o código que estiver lá (geralmente `function myFunction() {}`) e cole o código abaixo:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var timestamp = new Date();
    var name = data.name || '';
    var email = data.email || '';
    var phone = data.phone || '';
    var cep = data.cep || '';
    var purchaseType = data.purchaseType || '';
    var summary = data.summary || '';
    var total = data.total || '';

    // 1. Salva na Planilha
    sheet.appendRow([timestamp, name, email, phone, cep, purchaseType, summary, total]);

    // 2. Envia por E-mail
    // Altere para os e-mails reais da equipe que vão processar o pedido
    var emailsDestino = "suporte@ocya.com.br,contato@ocya.com.br"; 
    
    var subject = "NOVO PEDIDO SQUAD OCYÁ: " + name;
    var body = "Olá Equipe Ocyá,\n\n" +
               "Um novo pedido foi recebido pelo site Squad Ocyá. Os detalhes estão abaixo:\n\n" +
               "--- DADOS DO CLIENTE ---\n" +
               "Nome: " + name + "\n" +
               "E-mail: " + email + "\n" +
               "Telefone: " + phone + "\n" +
               "CEP: " + cep + "\n\n" +
               "--- DETALHES DO PEDIDO ---\n" +
               "Tipo: " + purchaseType + "\n" +
               "Resumo: " + summary + "\n" +
               "Valor Estimado: " + total + "\n\n" +
               "Por favor, procedam com o cadastro/ativação deste pedido na plataforma de assinatura e entrem em contato com o influenciador, se necessário.\n\n" +
               "Atenciosamente,\n" +
               "Automação Squad Ocyá";

    MailApp.sendEmail({
      to: emailsDestino,
      subject: subject,
      body: body
    });

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Clique no ícone de **Salvar** (disquete) ou `Ctrl+S`.

## 3. Publicar (Gerar a URL)

1. No canto superior direito, clique no botão azul **Implantar > Nova implantação**.
2. Na engrenagem de "Selecione o tipo", escolha **App da Web**.
3. Preencha assim:
   - Descrição: `Webhook Squad Ocya`
   - Executar como: **Eu (seu.email@ocya.com.br)**
   - Quem pode acessar: **Qualquer pessoa** *(Muito importante! Sem isso, o site não consegue enviar os pedidos)*
4. Clique em **Implantar**.
5. O Google pedirá autorização. Clique em "Autorizar acessos", escolha sua conta. Se aparecer aviso de segurança ("aplicativo não verificado"), clique em "Avançado" e depois em "Acessar (não seguro)".
6. Permita o envio de e-mails e acesso às planilhas.
7. O Google vai te dar uma **URL do App da Web**. Copie essa URL — ela termina em `/exec`.

## 4. Atualizar a URL no Site

> ⚠️ **Atenção ao configurar a variável na Vercel:** Cole **apenas a URL** no campo de valor, sem nenhum prefixo. O valor correto é somente:
> ```
> https://script.google.com/macros/s/.../exec
> ```
> Não copie a linha inteira do `.env.local` (que inclui `NEXT_PUBLIC_GOOGLE_SCRIPT_URL=`). Isso faria o site tentar fazer POST para uma URL inválida.

Para configurar via CLI (recomendado):

```bash
# Apagar versão antiga (se existir)
vercel env rm NEXT_PUBLIC_GOOGLE_SCRIPT_URL production --yes
vercel env rm NEXT_PUBLIC_GOOGLE_SCRIPT_URL preview --yes
vercel env rm NEXT_PUBLIC_GOOGLE_SCRIPT_URL development --yes

# Adicionar com o valor correto
echo "https://script.google.com/macros/s/SUA_URL_AQUI/exec" | vercel env add NEXT_PUBLIC_GOOGLE_SCRIPT_URL production
echo "https://script.google.com/macros/s/SUA_URL_AQUI/exec" | vercel env add NEXT_PUBLIC_GOOGLE_SCRIPT_URL preview
echo "https://script.google.com/macros/s/SUA_URL_AQUI/exec" | vercel env add NEXT_PUBLIC_GOOGLE_SCRIPT_URL development
```

Após adicionar, faça um redeploy para o build recompilar com a nova URL (variáveis `NEXT_PUBLIC_*` são injetadas em build time):

```bash
vercel --prod --yes
```

---

## 5. Testar o Webhook

Após configurar, você pode testar com o seguinte comando no terminal:

```bash
curl -X POST "SUA_URL_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@ocya.com.br","phone":"(21) 99999-9999","cep":"22071-000","purchaseType":"Assinatura","summary":"Plano: Seleção do Mar\nPessoas: 2","total":"340,00"}'
```

Se tudo estiver correto, deve aparecer uma linha nova na planilha e um e-mail chegar nas caixas de suporte@ocya.com.br e contato@ocya.com.br.

> **Nota sobre o `curl`:** O comando acima pode retornar HTTP 405 dependendo dos redirecionamentos do Google. Isso é comportamento do `curl` com URLs do Apps Script — não indica erro no script. O teste definitivo é preencher o formulário no site e verificar a planilha.

---

## 6. Se precisar atualizar o script depois

Se você editar o código do Apps Script, **não basta salvar** — é preciso criar uma nova implantação:

1. Clique em **Implantar > Gerenciar implantações**.
2. Na implantação existente, clique no lápis de edição.
3. Em "Versão", selecione **"Nova versão"**.
4. Clique em **Implantar**.

A URL permanece a mesma — não precisa atualizar na Vercel.
