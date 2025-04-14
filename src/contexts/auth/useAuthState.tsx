
import { useState } from "react";
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
   * Check connection with Firebase
   */
  const checkConnection = async () => {
    try {
      await syncStorage.checkConnection();
      setIsOfflineMode(false);
      console.log("Conexão com o Firebase estabelecida com sucesso");
      return true;
    } catch (error) {
      console.warn("Funcionando em modo offline:", error);
      setIsOfflineMode(true);
      return false;
    }
  };

  /**
   * Initialize default data
   */
  const initializeDefaultData = async () => {
    try {
      await syncStorage.initializeDefaultData();
      console.log("Dados inicializados com sucesso");
      return true;
    } catch (error) {
      console.warn("Erro ao inicializar dados:", error);
      return false;
    }
  };

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
