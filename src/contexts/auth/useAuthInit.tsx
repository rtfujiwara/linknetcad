
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
    let isMounted = true;
    
    const checkAuth = async () => {
      // Se o componente for desmontado durante a inicialização, não fazer nada
      if (!isMounted) return;
      
      setIsLoading(true);
      
      // Estabelecer um timeout mais curto para garantir que a interface não fique travada
      const initTimeout = setTimeout(() => {
        if (!isMounted) return;
        
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
        
        if (isMounted) {
          setIsLoading(false);
        }
      }, 3000); // Reduzido de 5s para 3s para melhor responsividade
      
      try {
        // Tenta verificar a conexão com o Firebase mais rapidamente
        let isConnected = false;
        try {
          isConnected = await Promise.race([
            checkConnection(),
            new Promise<boolean>((resolve) => {
              setTimeout(() => resolve(false), 2000); // Timeout mais curto
            })
          ]);
          
          if (isMounted) {
            setIsOfflineMode(!isConnected);
          }
        } catch (error) {
          console.warn("Funcionando em modo offline:", error);
          if (isMounted) {
            setIsOfflineMode(true);
          }
        }

        // Inicializa dados padrão se necessário
        try {
          if (isMounted) {
            // Usa timeout para evitar espera excessiva
            await Promise.race([
              initializeDefaultData(),
              new Promise<boolean>((resolve) => {
                setTimeout(() => resolve(false), 2000);
              })
            ]);
          }
        } catch (error) {
          console.warn("Erro ao inicializar dados:", error);
        }

        // Recupera o usuário atual do localStorage
        if (isMounted) {
          const storedUser = localStorage.getItem("currentUser");
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
            console.log("Usuário recuperado do localStorage com sucesso");
          }
        }
        
        // Cancela o timeout já que completamos a inicialização
        clearTimeout(initTimeout);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        if (isMounted) {
          setIsOfflineMode(true);
          
          // Mesmo em modo offline, tenta recuperar o usuário do localStorage
          const storedUser = localStorage.getItem("currentUser");
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          clearTimeout(initTimeout); // Garante que o timeout seja cancelado
        }
      }
    };

    checkAuth();
    
    // Configura uma verificação periódica de conectividade
    const periodicCheck = setInterval(() => {
      if (isMounted) {
        checkConnection().then(isConnected => {
          if (isMounted) {
            setIsOfflineMode(!isConnected);
          }
        });
      }
    }, 30000); // Verifica a cada 30 segundos
    
    // Limpeza do useEffect
    return () => {
      isMounted = false;
      clearInterval(periodicCheck); // Limpa o intervalo de verificação
    };
  }, [setCurrentUser, setIsLoading, setIsOfflineMode, checkConnection, initializeDefaultData, toast]);
};
