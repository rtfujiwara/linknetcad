
import { useEffect } from "react";
import { User } from "@/types/user";

/**
 * Hook to initialize authentication state
 */
export const useAuthInit = (
  setCurrentUser: (user: User | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  setIsOfflineMode: (isOffline: boolean) => void,
  checkConnection: () => Promise<boolean>,
  initializeDefaultData: () => Promise<boolean>,
  toast: any
) => {
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Estabelecer um timeout para garantir que a inicialização não fique travada
      const initTimeout = setTimeout(() => {
        console.warn("Timeout de inicialização, entrando em modo offline");
        setIsOfflineMode(true);
        
        // Recupera o usuário atual do localStorage como fallback
        try {
          const storedUser = localStorage.getItem("currentUser");
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
            console.log("Usuário recuperado do localStorage após timeout");
          }
        } catch (localError) {
          console.error("Erro ao recuperar usuário do localStorage:", localError);
        }
        
        setIsLoading(false);
      }, 5000);
      
      try {
        // Tenta verificar a conexão com o Firebase
        try {
          const isConnected = await checkConnection();
          setIsOfflineMode(!isConnected);
        } catch (error) {
          console.warn("Funcionando em modo offline:", error);
          setIsOfflineMode(true);
        }

        // Inicializa dados padrão se necessário
        try {
          await initializeDefaultData();
        } catch (error) {
          console.warn("Erro ao inicializar dados:", error);
        }

        // Recupera o usuário atual do localStorage
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
          console.log("Usuário recuperado do localStorage com sucesso");
        }
        
        // Cancela o timeout já que completamos a inicialização
        clearTimeout(initTimeout);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsOfflineMode(true);
        
        // Mesmo em modo offline, tenta recuperar o usuário do localStorage
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
        clearTimeout(initTimeout); // Garante que o timeout seja cancelado
      }
    };

    checkAuth();
  }, [setCurrentUser, setIsLoading, setIsOfflineMode, checkConnection, initializeDefaultData, toast]);
};
