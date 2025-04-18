
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
              margin-bottom: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 60px;
              padding: 20px 0;
            }
            .header img {
              height: 120px;
              width: auto;
            }
            .header h2 {
              margin: 0;
              text-transform: uppercase;
              font-size: 16px;
              font-weight: bold;
            }
            .section-title {
              background-color: #e0e0e0;
              padding: 5px 10px;
              margin: 20px 0 10px 0;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 13px;
            }
            .client-info {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .client-info tr td {
              padding: 8px 5px;
              border-bottom: 1px solid #999;
              line-height: 1.4;
            }
            .client-info td:first-child {
              font-weight: bold;
              width: 200px;
            }
            .footer {
              margin-top: 50px;
            }
            .date-line {
              margin-bottom: 50px;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin: 60px 40px;
            }
            .signature-line {
              width: 250px;
              border-top: 1px solid black;
              text-align: center;
              padding-top: 5px;
              font-weight: bold;
            }
            .company-info {
              margin-top: 60px;
              text-align: center;
              font-size: 11px;
              line-height: 1.6;
            }
            .button-container {
              display: flex;
              gap: 10px;
              margin-top: 20px;
              justify-content: center;
            }
            .btn {
              padding: 8px 16px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
              font-size: 14px;
            }
            .btn-print {
              background-color: #3b82f6;
              color: white;
            }
            .btn-back {
              background-color: #e0e0e0;
              color: #333;
            }
            @media print {
              .no-print {
                display: none;
              }
              @page {
                margin: 20mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/lovable-uploads/24ee217e-48fb-44ac-bc9a-8bf49825944c.png" alt="Linknet Vale Logo" />
            <h2>Proposta de Adesão</h2>
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
            <div class="date-line">Jacarei, _____ de __________________ de ${new Date().getFullYear()}</div>
            
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

          <div class="button-container no-print">
            <button class="btn btn-back" onclick="window.close()">Voltar</button>
            <button class="btn btn-print" onclick="window.print()">Imprimir</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};
