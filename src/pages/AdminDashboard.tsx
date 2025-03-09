import { useState, useEffect } from "react";
import { ClientsTable } from "@/components/admin/ClientsTable";
import { EditClientModal } from "@/components/admin/EditClientModal";
import { Client } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { printClientData } from "@/utils/printClient";
import { syncStorage } from "@/utils/syncStorage";

const AdminDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [updatedClient, setUpdatedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const savedClients = syncStorage.getItem<Client[]>("clients", []);
    setClients(savedClients);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setUpdatedClient(client);
  };

  const handlePrint = (client: Client) => {
    printClientData(client);
  };

  const handleDelete = (client: Client) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      const updatedClients = clients.filter((c) => c.id !== client.id);
      syncStorage.setItem("clients", updatedClients);
      setClients(updatedClients);
      toast({
        title: "Cliente excluído",
        description: "O cliente foi removido com sucesso.",
      });
    }
  };

  const handleSaveEdit = (client: Client) => {
    const updatedClients = clients.map((c) => 
      c.id === client.id ? client : c
    );
    syncStorage.setItem("clients", updatedClients);
    setClients(updatedClients);
    setEditingClient(null);
    setUpdatedClient(null);
    toast({
      title: "Cliente atualizado",
      description: "As informações do cliente foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
      <ClientsTable
        clients={clients}
        onEdit={handleEdit}
        onPrint={handlePrint}
        onDelete={handleDelete}
      />
      {editingClient && updatedClient && (
        <EditClientModal
          client={updatedClient}
          onSave={handleSaveEdit}
          onCancel={() => setEditingClient(null)}
          onChange={(updatedClient) => setUpdatedClient(updatedClient)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
