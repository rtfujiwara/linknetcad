
export const printClient = (client) => {
  if (!client) return;
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para imprimir os dados do cliente.');
    return;
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dados do Cliente ${client.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 20px;
        }
        h1 {
          color: #2563eb;
          border-bottom: 1px solid #ccc;
          padding-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f0f9ff;
          font-weight: bold;
        }
        .section-title {
          margin-top: 20px;
          color: #1e40af;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          font-size: 0.9em;
          text-align: center;
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>Dados do Cliente</h1>
      <div class="section-title">Informações Pessoais</div>
      <table>
        <tr>
          <th>Nome:</th>
          <td>${client.name || '-'}</td>
        </tr>
        <tr>
          <th>E-mail:</th>
          <td>${client.email || '-'}</td>
        </tr>
        <tr>
          <th>CPF/CNPJ:</th>
          <td>${client.document || '-'}</td>
        </tr>
        <tr>
          <th>RG/IE:</th>
          <td>${client.rgIe || '-'}</td>
        </tr>
        <tr>
          <th>Data de Nascimento:</th>
          <td>${client.birthDate || '-'}</td>
        </tr>
      </table>
      
      <div class="section-title">Endereço</div>
      <table>
        <tr>
          <th>Endereço:</th>
          <td>${client.address || '-'}, ${client.number || '-'}</td>
        </tr>
        <tr>
          <th>Complemento:</th>
          <td>${client.complement || '-'}</td>
        </tr>
        <tr>
          <th>Bairro:</th>
          <td>${client.neighborhood || '-'}</td>
        </tr>
        <tr>
          <th>Cidade/Estado:</th>
          <td>${client.city || '-'} / ${client.state || '-'}</td>
        </tr>
        <tr>
          <th>CEP:</th>
          <td>${client.zipCode || '-'}</td>
        </tr>
        <tr>
          <th>Condomínio:</th>
          <td>${client.condoName || '-'}</td>
        </tr>
      </table>
      
      <div class="section-title">Contato</div>
      <table>
        <tr>
          <th>Telefone Principal:</th>
          <td>${client.phone || '-'}</td>
        </tr>
        <tr>
          <th>Telefone Alternativo:</th>
          <td>${client.alternativePhone || '-'}</td>
        </tr>
      </table>
      
      <div class="section-title">Plano e Pagamento</div>
      <table>
        <tr>
          <th>Plano:</th>
          <td>${client.plan || '-'}</td>
        </tr>
        <tr>
          <th>Dia de Vencimento:</th>
          <td>${client.dueDate || '-'}</td>
        </tr>
      </table>
      
      <div class="section-title">Wi-Fi</div>
      <table>
        <tr>
          <th>Nome da Rede:</th>
          <td>${client.wifiName || '-'}</td>
        </tr>
        <tr>
          <th>Senha:</th>
          <td>${client.wifiPassword || '-'}</td>
        </tr>
      </table>
      
      <div class="footer">
        <p>Impresso em ${new Date().toLocaleString()}</p>
        <p>LINKNET - Seu provedor de internet de confiança</p>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
