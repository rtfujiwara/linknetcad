import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { syncStorage } from "@/utils/syncStorage";
import { User, Permission } from "@/types/user";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  hasPermission: (permission: Permission) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verificar se há um usuário logado
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Adicionar listener para mudanças nos usuários
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      // Se a lista de usuários mudar e o usuário atual estiver logado
      if (key === "users" && currentUser) {
        // Verifica se o usuário atual ainda existe na lista
        const updatedUserList = value as User[];
        const userStillExists = updatedUserList.some(user => user.id === currentUser.id);
        
        if (!userStillExists) {
          // Se o usuário foi removido, faz logout
          logout();
          toast({
            title: "Sessão encerrada",
            description: "Sua conta foi removida por um administrador.",
          });
        } else {
          // Atualiza as informações do usuário atual
          const updatedUser = updatedUserList.find(user => user.id === currentUser.id);
          if (updatedUser) {
            setCurrentUser(updatedUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          }
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate, currentUser]);

  const login = async (username: string, password: string) => {
    try {
      const users = await syncStorage.getItem<User[]>("users", []);
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/admin/dashboard");
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Usuário ou senha incorretos",
        });
        return false;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.",
      });
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigate("/admin");
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser) return false;

    try {
      if (currentUser.password !== currentPassword) {
        toast({
          variant: "destructive",
          title: "Senha atual incorreta",
          description: "A senha atual informada está incorreta.",
        });
        return false;
      }

      const users = await syncStorage.getItem<User[]>("users", []);
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? { ...user, password: newPassword } : user
      );

      await syncStorage.setItem("users", updatedUsers);

      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
      return true;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast({
        variant: "destructive",
        title: "Erro ao alterar senha",
        description: "Ocorreu um erro ao alterar a senha. Por favor, tente novamente.",
      });
      return false;
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    if (currentUser.isAdmin) return true;
    return currentUser.permissions.includes(permission);
  };

  const isAdmin = (): boolean => {
    return !!currentUser?.isAdmin;
  };

  return (
    <AuthContext.Provider
      value={{ 
        currentUser, 
        login, 
        logout, 
        changePassword, 
        hasPermission, 
        isAdmin 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
