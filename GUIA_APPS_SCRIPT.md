# Guia de Configuração: Google Apps Script (Squad Ocyá)

Este documento contém o script necessário para receber os pedidos dos influenciadores, salvar em uma planilha e enviar por e-mail automaticamente.

---

## ⚠️ Diagnóstico: Por que o webhook não está funcionando?

A URL atual configurada retorna **HTTP 405 (Method Not Allowed)**, o que indica um dos seguintes problemas:

1. **A implantação do Apps Script está desatualizada** — o código foi editado mas não foi re-implantado como nova versão.
2. **A função `doPost` não existe ou não foi salva** no script antes da implantação.
3. **A permissão está errada** — "Quem pode acessar" não está definido como **"Qualquer pessoa"**.

**Solução:** Seguir os passos abaixo para criar e implantar o script corretamente.

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
    
    var subject = "🚨 NOVO PEDIDO SQUAD OCYÁ: " + name;
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

1. Acesse o painel da Vercel: [vercel.com/dashboard](https://vercel.com/dashboard)
2. Entre no projeto **squad-ocya-em-casa**.
3. Vá em **Settings > Environment Variables**.
4. Localize `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` e clique em editar.
5. Cole a nova URL gerada no passo anterior.
6. Salve e **redeploy** o projeto para a mudança entrar em vigor.

---

## 5. Testar o Webhook

Após configurar, você pode testar com o seguinte comando no terminal:

```bash
curl -X POST "SUA_URL_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@ocya.com.br","phone":"(21) 99999-9999","cep":"22071-000","purchaseType":"Assinatura","summary":"Plano: Seleção do Mar\nPessoas: 2","total":"340,00"}'
```

Se tudo estiver correto, deve aparecer uma linha nova na planilha e um e-mail chegar nas caixas de suporte@ocya.com.br e contato@ocya.com.br.

---

## 6. Se precisar atualizar o script depois

Se você editar o código do Apps Script, **não basta salvar** — é preciso criar uma nova implantação:

1. Clique em **Implantar > Gerenciar implantações**.
2. Na implantação existente, clique no lápis de edição.
3. Em "Versão", selecione **"Nova versão"**.
4. Clique em **Implantar**.

A URL permanece a mesma — não precisa atualizar na Vercel.
