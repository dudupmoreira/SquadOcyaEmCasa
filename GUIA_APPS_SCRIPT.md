# Guia de Configuração: Google Apps Script (Squad Ocyá)

Este documento contém o script necessário para receber os pedidos dos influenciadores, salvar em uma planilha e enviar por e-mail automaticamente.

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
    // Altere para os e-mails reais da equipe que vão processar o pedido na BetaLabs
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
               "Por favor, procedam com o cadastro/ativação deste pedido no painel da BetaLabs e entrem em contato com o influenciador, se necessário.\n\n" +
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

3. Clique no ícone de **Salvar** (disquete).

## 3. Publicar (Gerar a URL)
1. No canto superior direito, clique no botão azul **Implantar > Nova implantação**.
2. Na engrenagem de "Selecione o tipo", escolha **App da Web**.
3. Preencha assim:
   - Descrição: `Webhook Squad Ocya`
   - Executar como: **Eu (seu.email@ocya.com.br)**
   - Quem pode acessar: **Qualquer pessoa** *(Muito importante!)*
4. Clique em **Implantar**.
5. O Google pedirá autorização. Clique em "Autorizar acessos", escolha sua conta, se aparecer aviso de segurança, clique em "Avançado" e depois em "Acessar Projeto sem título (não seguro)".
6. Permita o envio de e-mails e acesso às planilhas.
7. O Google vai te dar uma **URL do App da Web**. Copie essa URL.

## 4. Colocar a URL no Site
1. Volte ao código do projeto `SquadOcyaEmCasa`.
2. Crie ou edite o arquivo `.env.local` na raiz da pasta `SquadOcyaEmCasa`.
3. Adicione a seguinte linha, colando a URL gerada no passo anterior:

```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SuaUrlGeradaAqui/exec
```

Pronto! Agora o site enviará os dados diretamente para sua planilha e e-mail.
