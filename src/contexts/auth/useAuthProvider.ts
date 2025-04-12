
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { User, Permission } from "@/types/user";
import { AuthContextData } from "./types";

export function useAuthProvider(): AuthContextData {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAndUpdateOfflineStatus = async () => {
    try {
      await syncStorage.checkConnection();
      setIsOfflineMode(false);
      return true;
    } catch (error) {
      console.error("Erro ao verificar status da conexão:", error);
      setIsOfflineMode(true);
      
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: error instanceof Error ? error.message : "Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.",
      });
      
      return false;
    }
  };

  const retryConnection = async (): Promise<boolean> => {
    toast({
      title: "Verificando conexão",
      description: "Tentando conectar ao banco de dados...",
    });
    
    try {
      await syncStorage.checkConnection();
      setIsOfflineMode(false);
      
      toast({
        title: "Conexão estabelecida",
        description: "Conexão com o banco de dados estabelecida com sucesso.",
      });
      
      return true;
    } catch (error) {
      setIsOfflineMode(true);
      
      toast({
        variant: "destructive",
        title: "Falha na conexão",
        description: error instanceof Error ? error.message : "Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.",
      });
      
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar status de conexão
        await checkAndUpdateOfflineStatus();
        
        // Verificar usuário armazenado
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
        
        // Inicializar dados padrão se necessário
        await syncStorage.initializeDefaultData();
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsOfflineMode(true);
        
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: error instanceof Error ? error.message : "Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Listener para mudanças nos usuários
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "users" && currentUser) {
        // Verifica se o usuário atual ainda existe após as mudanças
        const userExists = value?.some((user: User) => user.id === currentUser.id);
        if (!userExists) {
          // Se o usuário não existe mais, faz logout
          logout();
          toast({
            title: "Sessão encerrada",
            description: "Seu usuário foi removido por um administrador.",
          });
        }
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser, navigate, toast]);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Verifica a conexão primeiro
      await syncStorage.checkConnection();
      
      // Obtém a lista de usuários
      const users = await syncStorage.getItem<User[]>("users", []);
      
      // Se não existem usuários, criar o admin padrão
      if (!users || users.length === 0) {
        await syncStorage.initializeDefaultData();
        const updatedUsers = await syncStorage.getItem<User[]>("users", []);
        
        if (!updatedUsers || updatedUsers.length === 0) {
          throw new Error("Não foi possível criar o usuário admin padrão. Verifique sua conexão com a internet.");
        }
      }
      
      // Busca o usuário com as credenciais fornecidas
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/admin/dashboard");
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema de administração.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Usuário ou senha incorretos.",
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar fazer login. Verifique sua conexão com a internet e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigate("/admin");
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.isAdmin) return true;
    return currentUser.permissions.includes(permission as Permission);
  };

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin || false,
    login,
    logout,
    hasPermission,
    isOfflineMode,
    retryConnection,
    isLoading
  };
}
