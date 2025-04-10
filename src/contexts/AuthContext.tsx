
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { User, Permission } from "@/types/user";
import { syncStorage } from "@/utils/syncStorage";

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  changePassword: (oldPassword: string, newPassword: string) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Recupera os dados do usuário autenticado do armazenamento local
  useEffect(() => {
    const storedUser = syncStorage.getItem<User | null>("currentUser", null);
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
    }
    
    // Adiciona listener para mudanças no armazenamento
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "currentUser") {
        if (value) {
          setCurrentUser(value);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
    });
    
    return () => {
      // Limpa o listener quando o componente for desmontado
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = (username: string, password: string) => {
    try {
      const users = syncStorage.getItem<User[]>("users", []);
      const user = users.find((u: User) => u.username === username);

      if (user && user.password === password) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        syncStorage.setItem("currentUser", user);
        navigate("/admin/dashboard");
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${user.name}!`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Credenciais inválidas",
        });
      }
    } catch (error) {
      console.error("Erro durante login:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login",
      });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    syncStorage.removeItem("currentUser");
    navigate("/");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    if (currentUser.isAdmin) return true;
    return currentUser.permissions.includes(permission);
  };

  const changePassword = (oldPassword: string, newPassword: string) => {
    if (!currentUser) return;

    if (currentUser.password !== oldPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Senha atual incorreta",
      });
      return;
    }

    try {
      const users = syncStorage.getItem<User[]>("users", []);
      const updatedUsers = users.map((u: User) => 
        u.id === currentUser.id ? { ...u, password: newPassword } : u
      );

      syncStorage.setItem("users", updatedUsers);
      
      // Atualiza o usuário atual também
      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
      syncStorage.setItem("currentUser", updatedUser);

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao tentar alterar a senha",
      });
    }
  };

  // Compute isAdmin based on the currentUser
  const isAdmin = currentUser?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser, 
      login, 
      logout, 
      hasPermission,
      changePassword,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
