
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextData } from "./types";
import { User, Permission } from "@/types/user";
import { syncStorage } from "@/utils/syncStorage";
import { AuthLoading } from "@/components/auth/AuthLoading";
import { userManagerUtils } from "@/components/admin/managerUtils";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextData | undefined>(undefined);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Componente provedor de autenticação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verifica a autenticação ao carregar o componente
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Tenta verificar a conexão com o Firebase
        try {
          await syncStorage.checkConnection();
          setIsOfflineMode(false);
          console.log("Conexão com o Firebase estabelecida com sucesso");
        } catch (error) {
          console.warn("Funcionando em modo offline:", error);
          setIsOfflineMode(true);
        }

        // Inicializa dados padrão se necessário
        try {
          await syncStorage.initializeDefaultData();
          console.log("Dados inicializados com sucesso");
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
  }, []);

  // Função para fazer login
  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Tenta verificar a conexão com o Firebase
      try {
        await syncStorage.checkConnection();
        setIsOfflineMode(false);
      } catch (error) {
        console.warn("Funcionando em modo offline:", error);
        setIsOfflineMode(true);
      }

      // Obtém a lista de usuários
      let users: User[] = [];
      
      try {
        users = await userManagerUtils.getUsers();
        console.log("Usuários carregados do servidor com sucesso");
      } catch (error) {
        console.error("Erro ao obter usuários do servidor:", error);
        
        // Em caso de erro, tenta usar os dados do localStorage
        users = userManagerUtils.getUsersSync();
        console.log("Usuários carregados do localStorage");
        
        if (users.length === 0 && username === "admin" && password === "admin") {
          // Cria um usuário admin padrão se não houver usuários e as credenciais forem as padrão
          const adminUser: User = {
            id: 1,
            username: "admin",
            password: "admin",
            name: "Administrador",
            isAdmin: true,
            permissions: ["view_clients", "edit_clients", "print_clients", "delete_data", "manage_plans", "manage_users"]
          };
          
          users = [adminUser];
          
          // Tenta salvar o usuário admin no localStorage
          try {
            await syncStorage.setItem("users", users);
            console.log("Usuário admin salvo com sucesso");
          } catch (e) {
            console.error("Erro ao salvar usuário admin:", e);
          }
        }
      }
      
      // Procura por um usuário com o nome de usuário e senha fornecidos
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        setCurrentUser(user);
        
        // Armazena o usuário no localStorage para persistência entre reloads
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema de administração.",
        });
        
        navigate("/admin/dashboard");
      } else {
        throw new Error("Usuário ou senha inválidos");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: error instanceof Error ? error.message : "Usuário ou senha incorretos.",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigate("/admin");
    
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso.",
    });
  };

  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    return (
      currentUser.isAdmin ||
      (currentUser.permissions && currentUser.permissions.includes(permission))
    );
  };

  // Função para tentar reconectar-se ao Firebase
  const retryConnection = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      await syncStorage.checkConnection();
      setIsOfflineMode(false);
      
      toast({
        title: "Conexão restabelecida",
        description: "A conexão com o servidor foi restabelecida com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao tentar reconectar:", error);
      setIsOfflineMode(true);
      
      toast({
        variant: "destructive",
        title: "Falha na conexão",
        description: "Não foi possível conectar ao servidor. Continuando em modo offline.",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Valores que serão fornecidos pelo contexto
  const authContextValue: AuthContextData = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: !!currentUser?.isAdmin,
    login,
    logout,
    hasPermission,
    isOfflineMode,
    retryConnection,
    isLoading,
  };

  // Se estiver carregando, mostra o componente de carregamento
  if (isLoading) {
    return <AuthLoading />;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
