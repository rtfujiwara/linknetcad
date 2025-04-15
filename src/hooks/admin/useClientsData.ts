
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";

export function useClientsData() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      try {
        // Verifica a conexão primeiro
        await syncStorage.checkConnection();
        
        // Carrega os clientes
        const savedClients = await syncStorage.getItem<Client[]>("clients", []);
        setClients(savedClients);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar clientes",
          description: error instanceof Error ? error.message : "Não foi possível carregar os clientes. Verifique sua conexão com a internet.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();

    // Listener para mudanças nos clientes
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "clients") {
        setClients(value || []);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  return {
    clients,
    setClients,
    isLoading
  };
}
