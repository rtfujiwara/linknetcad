
export const printClient = (client: any) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dados do Cliente</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .client-info {
              margin-bottom: 20px;
            }
            .client-info p {
              margin: 8px 0;
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
            <h1>Dados do Cliente</h1>
          </div>
          <div class="client-info">
            <p><strong>Nome:</strong> ${client.name}</p>
            <p><strong>E-mail:</strong> ${client.email}</p>
            <p><strong>CPF/CNPJ:</strong> ${client.document}</p>
            <p><strong>RG/IE:</strong> ${client.rgIe}</p>
            <p><strong>Data de Nascimento:</strong> ${client.birthDate}</p>
            <p><strong>Endereço:</strong> ${client.address}, ${client.number}</p>
            <p><strong>Complemento:</strong> ${client.complement || '-'}</p>
            <p><strong>Bairro:</strong> ${client.neighborhood}</p>
            <p><strong>Cidade:</strong> ${client.city}</p>
            <p><strong>Estado:</strong> ${client.state}</p>
            <p><strong>CEP:</strong> ${client.zipCode}</p>
            <p><strong>Condomínio:</strong> ${client.condoName || '-'}</p>
            <p><strong>Telefone:</strong> ${client.phone}</p>
            <p><strong>Telefone Recado:</strong> ${client.alternativePhone || '-'}</p>
            <p><strong>Plano:</strong> ${client.plan}</p>
            <p><strong>Vencimento:</strong> ${client.dueDate}</p>
            <p><strong>Nome do Wi-Fi:</strong> ${client.wifiName || '-'}</p>
            <p><strong>Senha do Wi-Fi:</strong> ${client.wifiPassword || '-'}</p>
          </div>
          <button class="no-print" onclick="window.print()">Imprimir</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};
