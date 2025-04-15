
import { useState, useEffect } from "react";
import { Plan } from "@/types/plan";
import { useToast } from "@/components/ui/use-toast";
import { planManagerUtils } from "@/components/admin/managerUtils";
import { syncStorage } from "@/utils/syncStorage";

export function usePlansData() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        // Verifica a conexão primeiro
        await syncStorage.checkConnection();
        
        // Carrega os planos
        const savedPlans = await planManagerUtils.getPlans();
        setPlans(savedPlans);
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar planos",
          description: error instanceof Error ? error.message : "Não foi possível carregar os planos. Verifique sua conexão com a internet.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();

    // Listener para mudanças nos planos
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "plans") {
        setPlans(value || []);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  return {
    plans,
    setPlans,
    isLoading
  };
}
