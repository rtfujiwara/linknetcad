
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Client {
  id: number;
  name: string;
  email: string;
  document: string;
  rgIe: string;
  birthDate: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  condoName: string;
  phone: string;
  alternativePhone: string;
  plan: string;
  dueDate: string;
  wifiName: string;
  wifiPassword: string;
}

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
    const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");
    setClients(savedClients);
  }, [isAuthenticated, navigate]);

  const handlePrint = (client: Client) => {
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

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
  };

  const handleSave = (updatedClient: Client) => {
    const updatedClients = clients.map((c) =>
      c.id === updatedClient.id ? updatedClient : c
    );
    setClients(updatedClients);
    localStorage.setItem("clients", JSON.stringify(updatedClients));
    setSelectedClient(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <div className="max-w-[95%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Painel Administrativo
          </h1>
          <Button onClick={logout} variant="outline">
            Sair
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.document}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.plan}</TableCell>
                  <TableCell>{client.dueDate}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrint(client)}
                      >
                        Imprimir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selectedClient && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
              <h2 className="text-xl font-semibold mb-4">Editar Cliente</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome</Label>
                  <Input
                    id="edit-name"
                    value={selectedClient.name}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-email">E-mail</Label>
                  <Input
                    id="edit-email"
                    value={selectedClient.email}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-document">CPF/CNPJ</Label>
                  <Input
                    id="edit-document"
                    value={selectedClient.document}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        document: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-rgIe">RG/IE</Label>
                  <Input
                    id="edit-rgIe"
                    value={selectedClient.rgIe}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        rgIe: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-birthDate">Data de Nascimento</Label>
                  <Input
                    id="edit-birthDate"
                    type="date"
                    value={selectedClient.birthDate}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        birthDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-address">Endereço</Label>
                  <Input
                    id="edit-address"
                    value={selectedClient.address}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-number">Número</Label>
                  <Input
                    id="edit-number"
                    value={selectedClient.number}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        number: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-complement">Complemento</Label>
                  <Input
                    id="edit-complement"
                    value={selectedClient.complement}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        complement: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-neighborhood">Bairro</Label>
                  <Input
                    id="edit-neighborhood"
                    value={selectedClient.neighborhood}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        neighborhood: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-city">Cidade</Label>
                  <Input
                    id="edit-city"
                    value={selectedClient.city}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        city: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-state">Estado</Label>
                  <Input
                    id="edit-state"
                    value={selectedClient.state}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        state: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-zipCode">CEP</Label>
                  <Input
                    id="edit-zipCode"
                    value={selectedClient.zipCode}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        zipCode: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-condoName">Nome do Condomínio</Label>
                  <Input
                    id="edit-condoName"
                    value={selectedClient.condoName}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        condoName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefone</Label>
                  <Input
                    id="edit-phone"
                    value={selectedClient.phone}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-alternativePhone">Telefone Recado</Label>
                  <Input
                    id="edit-alternativePhone"
                    value={selectedClient.alternativePhone}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        alternativePhone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-plan">Plano</Label>
                  <Input
                    id="edit-plan"
                    value={selectedClient.plan}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        plan: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">Data de Vencimento</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={selectedClient.dueDate}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        dueDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-wifiName">Nome do Wi-Fi</Label>
                  <Input
                    id="edit-wifiName"
                    value={selectedClient.wifiName}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        wifiName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-wifiPassword">Senha do Wi-Fi</Label>
                  <Input
                    id="edit-wifiPassword"
                    type="password"
                    value={selectedClient.wifiPassword}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        wifiPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClient(null)}
                >
                  Cancelar
                </Button>
                <Button onClick={() => handleSave(selectedClient)}>
                  Salvar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
