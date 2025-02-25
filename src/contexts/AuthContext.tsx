
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { User, Permission } from "@/types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  changePassword: (oldPassword: string, newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const authUser = localStorage.getItem("currentUser");
    if (authUser) {
      const user = JSON.parse(authUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: User) => u.username === username);

    if (user && user.password === password) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
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
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
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

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: User) => 
      u.id === currentUser.id ? { ...u, password: newPassword } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setCurrentUser({ ...currentUser, password: newPassword });
    localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, password: newPassword }));

    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser, 
      login, 
      logout, 
      hasPermission,
      changePassword 
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
