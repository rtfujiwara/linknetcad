
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { useAuth } from "@/contexts/AuthContext";
import { useClientsData } from "./admin/useClientsData";
import { usePlansData } from "./admin/usePlansData";
import { useClientOperations } from "./admin/useClientOperations";
import { usePlanOperations } from "./admin/usePlanOperations";

export function useAdminDashboard() {
  const { toast } = useToast();
  const { isOfflineMode } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Load clients and plans data
  const { clients, setClients } = useClientsData();
  const { plans, setPlans } = usePlansData();

  // Setup operations for clients and plans
  const { 
    editingClient, 
    updatedClient, 
    handleEdit, 
    handlePrint, 
    handleDelete, 
    handleSaveEdit, 
    setUpdatedClient 
  } = useClientOperations(clients, setClients);

  const { handleAddPlan, handleDeletePlan } = usePlanOperations(plans, setPlans);

  // Check connection and initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // Verifica a conexão primeiro
        await syncStorage.checkConnection();
        
        // Inicializa os dados padrão se necessário
        await syncStorage.initializeDefaultData();
      } catch (error) {
        console.error("Erro ao inicializar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao inicializar",
          description: error instanceof Error ? error.message : "Não foi possível inicializar os dados. Verifique sua conexão com a internet.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [toast]);

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
