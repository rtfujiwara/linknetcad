
import { useState, useEffect } from 'react';
import { syncStorage } from "@/utils/syncStorage";
import { useToast } from "@/components/ui/use-toast";

export const useConnectionStatus = () => {
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const isConnected = await syncStorage.checkConnection();
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
    });
    
    return () => {
      // Clean up when component unmounts
      syncStorage.stopAutoReconnect?.();
    };
  }, []);

  const handleRetryConnection = async () => {
    setIsOffline(true);
    syncStorage.resetConnectionCheck?.();
    
    try {
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
    }
  };

  return {
    isOffline,
    handleRetryConnection
  };
};
