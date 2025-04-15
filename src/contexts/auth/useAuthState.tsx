
import { useState, useCallback } from "react";
import { User } from "@/types/user";
import { syncStorage } from "@/utils/syncStorage";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

/**
 * Hook to manage authentication state
 */
export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  /**
   * Check connection with Firebase with retry limit to prevent loops
   */
  const checkConnection = useCallback(async () => {
    try {
      // Usa um timeout para garantir que a verificação não fique presa
      const connectionPromise = syncStorage.checkConnection();
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.warn("Timeout na verificação de conexão");
          resolve(false);
        }, 3000);
      });
      
      const isConnected = await Promise.race([connectionPromise, timeoutPromise]);
      
      setIsOfflineMode(!isConnected);
      console.log(isConnected ? "Conexão com o Firebase estabelecida com sucesso" : "Sem conexão com o Firebase");
      return isConnected;
    } catch (error) {
      console.warn("Funcionando em modo offline:", error);
      setIsOfflineMode(true);
      return false;
    }
  }, []);

  /**
   * Initialize default data with timeout
   */
  const initializeDefaultData = useCallback(async () => {
    try {
      // Usa um timeout para garantir que a inicialização não fique presa
      const initPromise = syncStorage.initializeDefaultData();
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.warn("Timeout na inicialização de dados");
          resolve(false);
        }, 3000);
      });
      
      const success = await Promise.race([initPromise, timeoutPromise]);
      
      if (success) {
        console.log("Dados inicializados com sucesso");
      } else {
        console.warn("Não foi possível inicializar todos os dados");
      }
      
      return success;
    } catch (error) {
      console.warn("Erro ao inicializar dados:", error);
      return false;
    }
  }, []);

  return {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    isOfflineMode,
    setIsOfflineMode,
    toast,
    navigate,
    checkConnection,
    initializeDefaultData,
  };
};
