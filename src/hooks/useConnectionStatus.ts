
import { useState, useEffect } from 'react';
import { syncStorage } from "@/utils/syncStorage";
import { useToast } from "@/components/ui/use-toast";

export const useConnectionStatus = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        console.log("Verificando status de conexão...");
        const isConnected = await syncStorage.checkConnection();
        console.log("Status de conexão:", isConnected ? "Conectado" : "Desconectado");
        setIsOffline(!isConnected);
      } catch (error) {
        console.error("Erro ao verificar conexão:", error);
        setIsOffline(true);
      }
    };
    
    checkConnectionStatus();
    
    // Configure auto reconnection
    syncStorage.startAutoReconnect?.(() => {
      setIsOffline(false);
      toast({
        title: "Conexão restabelecida",
        description: "A conexão com o servidor foi restaurada com sucesso.",
      });
    });
    
    return () => {
      // Clean up when component unmounts
      syncStorage.stopAutoReconnect?.();
    };
  }, [toast]);

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    syncStorage.resetConnectionCheck?.();
    
    try {
      console.log("Tentando reconectar...");
      const isConnected = await syncStorage.checkConnection();
      setIsOffline(!isConnected);
      
      if (isConnected) {
        toast({
          title: "Conexão restabelecida",
          description: "A conexão com o servidor foi restaurada com sucesso.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sem conexão",
          description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
        });
      }
    } catch (error) {
      console.error("Erro ao tentar reconectar:", error);
      toast({
        variant: "destructive",
        title: "Falha na reconexão",
        description: "Não foi possível verificar a conexão. Verifique sua internet.",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    isOffline,
    isRetrying,
    handleRetryConnection
  };
};
