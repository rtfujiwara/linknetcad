
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { syncStorage } from "@/utils/syncStorage";
import { useToast } from "@/components/ui/use-toast";
import { User, Permission } from "@/types/user";

interface AuthContextData {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isOfflineMode: boolean;
  retryConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAndUpdateOfflineStatus = async () => {
    try {
      const isOnline = await syncStorage.checkConnection();
      setIsOfflineMode(!isOnline);
      return isOnline;
    } catch (error) {
      console.error("Erro ao verificar status da conexão:", error);
      setIsOfflineMode(true);
      return false;
    }
  };

  const retryConnection = async (): Promise<boolean> => {
    toast({
      title: "Verificando conexão",
      description: "Tentando reconectar ao servidor...",
    });
    
    const isOnline = await checkAndUpdateOfflineStatus();
    
    if (isOnline) {
      toast({
        title: "Conexão restabelecida",
        description: "O sistema agora está operando em modo online.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Falha na conexão",
        description: "Não foi possível conectar ao servidor. Continuando em modo offline.",
      });
    }
    
    return isOnline;
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
        
        // Inicializar dados padrão se necessário (assegura que sempre teremos ao menos dados básicos)
        await syncStorage.initializeDefaultData();
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsOfflineMode(true);
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
      await checkAndUpdateOfflineStatus();
      
      // Adiciona um timeout para não ficar preso infinitamente
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout ao tentar login")), 10000);
      });
      
      const usersPromise = syncStorage.getItem<User[]>("users", []);
      
      // Utiliza Promise.race para garantir que não ficará carregando para sempre
      let users;
      try {
        users = await Promise.race([usersPromise, timeoutPromise]);
      } catch (error) {
        console.error("Erro ao obter usuários:", error);
        // Em caso de erro, tenta obter do localStorage
        users = syncStorage.getItemSync<User[]>("users", []);
      }
      
      // Se não existem usuários, criar o admin padrão
      if (!users || users.length === 0) {
        await syncStorage.initializeDefaultData();
        users = syncStorage.getItemSync<User[]>("users", []);
      }
      
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/admin/dashboard");
        
        toast({
          title: isOfflineMode ? "Login realizado (Modo Offline)" : "Login realizado",
          description: isOfflineMode 
            ? "Você está operando em modo offline. Algumas funcionalidades podem estar limitadas." 
            : "Bem-vindo ao sistema de administração.",
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
        title: "Erro",
        description: "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.",
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Carregando...
          </span>
        </div>
        <p className="mt-2">Carregando...</p>
      </div>
    </div>;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.isAdmin || false,
        login,
        logout,
        hasPermission,
        isOfflineMode,
        retryConnection
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
