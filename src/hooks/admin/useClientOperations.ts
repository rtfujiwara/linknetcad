
import { Client } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useClientOperations(clients: Client[], setClients: (clients: Client[]) => void) {
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [updatedClient, setUpdatedClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const { isOfflineMode } = useAuth();

  const handleEdit = (client: Client) => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não é possível editar clientes sem conexão com o banco de dados."
      });
      return;
    }
    
    setEditingClient(client);
    setUpdatedClient(client);
  };

  const handlePrint = (client: Client) => {
    import("@/utils/printClient").then(module => {
      module.printClient(client);
    });
  };

  const handleDelete = async (client: Client) => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não é possível excluir clientes sem conexão com o banco de dados."
      });
      return;
    }
    
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      try {
        await syncStorage.checkConnection();
        
        const updatedClients = clients.filter((c) => c.id !== client.id);
        await syncStorage.setItem("clients", updatedClients);
        setClients(updatedClients);
        
        toast({
          title: "Cliente excluído",
          description: "O cliente foi removido com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error instanceof Error ? error.message : "Não foi possível excluir o cliente. Verifique sua conexão com a internet.",
        });
      }
    }
  };

  const handleSaveEdit = async (client: Client) => {
    try {
      await syncStorage.checkConnection();
      
      const updatedClients = clients.map((c) => 
        c.id === client.id ? client : c
      );
      
      await syncStorage.setItem("clients", updatedClients);
      setClients(updatedClients);
      setEditingClient(null);
      setUpdatedClient(null);
      
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o cliente. Verifique sua conexão com a internet.",
      });
    }
  };

  return {
    editingClient,
    updatedClient,
    handleEdit,
    handlePrint,
    handleDelete,
    handleSaveEdit,
    setUpdatedClient
  };
}
