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
  phone: string;
  address: string;
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
    // Carregar clientes do localStorage
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
              <p><strong>Telefone:</strong> ${client.phone}</p>
              <p><strong>Endereço:</strong> ${client.address}</p>
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Painel Administrativo
          </h1>
          <Button onClick={logout} variant="outline">
            Sair
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Editar Cliente</h2>
              <div className="space-y-4">
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div className="flex justify-end space-x-2">
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
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
