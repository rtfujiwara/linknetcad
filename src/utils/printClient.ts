
export const printClient = (client: any) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Proposta de Adesão</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .header h2 {
              margin: 0;
              text-transform: uppercase;
              font-size: 14px;
            }
            .section-title {
              background-color: #f0f0f0;
              padding: 5px;
              margin: 15px 0 10px 0;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 12px;
            }
            .client-info {
              width: 100%;
              margin-bottom: 15px;
            }
            .client-info tr td {
              border-bottom: 1px solid #ccc;
              padding: 5px 2px;
            }
            .client-info td:first-child {
              font-weight: bold;
              width: 150px;
            }
            .footer {
              margin-top: 40px;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 60px;
            }
            .signature-line {
              width: 200px;
              border-top: 1px solid black;
              text-align: center;
              padding-top: 5px;
            }
            .company-info {
              margin-top: 40px;
              text-align: center;
              font-size: 10px;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Proposta de Adesão</h2>
            <img src="/lovable-uploads/ec3a75ed-2bd7-4293-a6b5-2730317a11d2.png" alt="Logo" style="height: 50px;" />
          </div>

          <div class="section-title">DADOS CADASTRAIS</div>
          <table class="client-info">
            <tr><td>Nome:</td><td>${client.name}</td></tr>
            <tr><td>Endereço:</td><td>${client.address}, Nº ${client.number}</td></tr>
            <tr><td>Bairro:</td><td>${client.neighborhood}</td></tr>
            <tr><td>CEP:</td><td>${client.zipCode}</td></tr>
            <tr><td>Celular:</td><td>${client.phone}</td></tr>
            <tr><td>CPF:</td><td>${client.document}</td></tr>
            <tr><td>Data de Nascimento:</td><td>${client.birthDate}</td></tr>
          </table>

          <div class="section-title">PLANO ILIMITADO DE INTERNET</div>
          <table class="client-info">
            <tr><td>Plano/Valor mensal:</td><td>${client.plan}</td></tr>
            <tr><td>Data de Vencimento:</td><td>Todo dia ${client.dueDate}</td></tr>
            <tr><td>Nome do Wi-Fi:</td><td>${client.wifiName || '-'}</td></tr>
            <tr><td>Senha do Wi-Fi:</td><td>${client.wifiPassword || '-'}</td></tr>
          </table>

          <div class="footer">
            <div>Jacarei, _____ de __________________ de ${new Date().getFullYear()}</div>
            
            <div class="signatures">
              <div class="signature-line">CONTRATADA</div>
              <div class="signature-line">CONTRATANTE</div>
            </div>

            <div class="company-info">
              CNPJ:32.234.473/0001-40<br>
              Contato: (12) 97401-1789 / (12) 99752-7165<br>
              E-mail: contato@linknetvale.com.br
            </div>
          </div>

          <button class="no-print" onclick="window.print()" style="margin-top: 20px;">Imprimir</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};
