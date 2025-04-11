
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { Plan } from "@/types/plan";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { planManagerUtils } from "@/components/admin/managerUtils";
import { useAuth } from "@/contexts/AuthContext";

export function useAdminDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [updatedClient, setUpdatedClient] = useState<Client | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isOfflineMode } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Verifica a conexão primeiro
        await syncStorage.checkConnection();
        
        // Carrega os dados
        await loadClients();
        await loadPlans();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error instanceof Error ? error.message : "Não foi possível carregar os dados. Verifique sua conexão com a internet.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Listener para mudanças nos clientes e planos
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "clients") {
        setClients(value || []);
      } else if (key === "plans") {
        setPlans(value || []);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const loadClients = async () => {
    const savedClients = await syncStorage.getItem<Client[]>("clients", []);
    setClients(savedClients);
  };

  const loadPlans = async () => {
    const savedPlans = await planManagerUtils.getPlans();
    setPlans(savedPlans);
  };

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

  const handleAddPlan = async (plan: Omit<Plan, "id">) => {
    try {
      await syncStorage.checkConnection();
      
      const newPlan: Plan = {
        id: Date.now(),
        ...plan,
      };
      
      const updatedPlans = [...plans, newPlan];
      await planManagerUtils.savePlans(updatedPlans);
      setPlans(updatedPlans);
      
      toast({
        title: "Plano adicionado",
        description: "O plano foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao adicionar plano:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível adicionar o plano. Verifique sua conexão com a internet.",
      });
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não é possível excluir planos sem conexão com o banco de dados."
      });
      return;
    }
    
    if (window.confirm("Tem certeza que deseja excluir este plano?")) {
      try {
        await syncStorage.checkConnection();
        
        const updatedPlans = plans.filter((p) => p.id !== id);
        await planManagerUtils.savePlans(updatedPlans);
        setPlans(updatedPlans);
        
        toast({
          title: "Plano excluído",
          description: "O plano foi removido com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao excluir plano:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error instanceof Error ? error.message : "Não foi possível excluir o plano. Verifique sua conexão com a internet.",
        });
      }
    }
  };

  return {
    clients,
    editingClient,
    updatedClient,
    plans,
    isLoading,
    handleEdit,
    handlePrint,
    handleDelete,
    handleSaveEdit,
    handleAddPlan,
    handleDeletePlan,
    setUpdatedClient
  };
}
