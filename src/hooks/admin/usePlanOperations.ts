
import { Plan } from "@/types/plan";
import { useToast } from "@/components/ui/use-toast";
import { planManagerUtils } from "@/components/admin/managerUtils";
import { syncStorage } from "@/utils/syncStorage";
import { useAuth } from "@/contexts/AuthContext";

export function usePlanOperations(plans: Plan[], setPlans: (plans: Plan[]) => void) {
  const { toast } = useToast();
  const { isOfflineMode } = useAuth();

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
    handleAddPlan,
    handleDeletePlan
  };
}
