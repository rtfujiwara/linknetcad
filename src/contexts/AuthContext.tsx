
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { syncStorage } from "@/utils/syncStorage";
import { useToast } from "@/components/ui/use-toast";
import { User, Permission } from "@/types/user";

interface AuthContextData {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean; // Adicionando a propriedade isAdmin
  login: (username: string, password: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
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
      
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/admin/dashboard");
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
    return <div>Carregando...</div>;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
