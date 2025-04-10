
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { Plan } from "@/types/plan";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { planManagerUtils } from "@/components/admin/managerUtils";

export function useAdminDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [updatedClient, setUpdatedClient] = useState<Client | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
    loadPlans();
  }, []);

  const loadClients = () => {
    const savedClients = syncStorage.getItem<Client[]>("clients", []);
    setClients(savedClients);
  };

  const loadPlans = () => {
    const savedPlans = planManagerUtils.getPlans();
    setPlans(savedPlans);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setUpdatedClient(client);
  };

  const handlePrint = (client: Client) => {
    import("@/utils/printClient").then(module => {
      module.printClient(client);
    });
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

  const handleAddPlan = (plan: Omit<Plan, "id">) => {
    const newPlan: Plan = {
      id: Date.now(),
      ...plan,
    };
    const updatedPlans = [...plans, newPlan];
    planManagerUtils.savePlans(updatedPlans);
    setPlans(updatedPlans);
    toast({
      title: "Plano adicionado",
      description: "O plano foi adicionado com sucesso.",
    });
  };

  const handleDeletePlan = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este plano?")) {
      const updatedPlans = plans.filter((p) => p.id !== id);
      planManagerUtils.savePlans(updatedPlans);
      setPlans(updatedPlans);
      toast({
        title: "Plano excluído",
        description: "O plano foi removido com sucesso.",
      });
    }
  };

  return {
    clients,
    editingClient,
    updatedClient,
    plans,
    handleEdit,
    handlePrint,
    handleDelete,
    handleSaveEdit,
    handleAddPlan,
    handleDeletePlan,
    setUpdatedClient
  };
}
