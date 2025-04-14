
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
      try {
        // Tenta verificar a conexão com o Firebase
        try {
          await checkConnection();
        } catch (error) {
          console.warn("Funcionando em modo offline:", error);
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
      }
    };

    checkAuth();
  }, []);
};
