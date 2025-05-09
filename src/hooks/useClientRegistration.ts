
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";

export const useClientRegistration = () => {
  const [plans, setPlans] = useState<{ id: number; name: string; price: number; description: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        // Tenta inicializar a conexão em segundo plano
        await syncStorage.checkConnection();
        
        if (!isInitialized) {
          await syncStorage.initializeDefaultData();
          setIsInitialized(true);
        }
        
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Timeout ao carregar planos")), 10000);
        });
        
        const plansPromise = syncStorage.getItem<{ id: number; name: string; price: number; description: string; }[]>("plans", []);
        
        const savedPlans = await Promise.race([plansPromise, timeoutPromise]);
        setPlans(savedPlans || []);
        
        if (savedPlans && savedPlans.length === 0) {
          // Tenta inicializar dados padrão novamente
          await syncStorage.initializeDefaultData();
          const defaultPlans = await syncStorage.getItem("plans", []);
          setPlans(defaultPlans);
        }
        
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
        setIsError(true);
        
        // Em caso de erro, tenta carregar do armazenamento local
        const localPlans = syncStorage.getItemSync<{ id: number; name: string; price: number; description: string; }[]>("plans", []);
        setPlans(localPlans);
        
        if (localPlans.length === 0) {
          toast({
            variant: "destructive",
            title: "Erro de conexão",
            description: "Não foi possível carregar os planos. Por favor, tente novamente.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();

    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "plans") {
        setPlans(value || []);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  return {
    plans,
    isLoading,
    isError,
    setIsLoading,
    setIsError,
    reloadPlans: () => window.location.reload(),
  };
};
