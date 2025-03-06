
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext(null);

// Nome da chave no localStorage para verificar inicialização
const STORAGE_INITIALIZED_KEY = "storage_initialized";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Função para garantir que o storage seja inicializado apenas uma vez
  const initializeStorage = () => {
    const isInitialized = localStorage.getItem(STORAGE_INITIALIZED_KEY);
    
    if (!isInitialized) {
      // Verificar se já existe algum dado no localStorage
      const existingUsers = localStorage.getItem("users");
      
      // Se não existir nenhum dado, considerar o storage como não inicializado
      if (!existingUsers || existingUsers === "[]") {
        console.log("Inicializando storage pela primeira vez");
        localStorage.setItem("users", "[]");
        localStorage.setItem("clients", "[]");
        localStorage.setItem("plans", "[]");
      }
      
      // Marcar storage como inicializado
      localStorage.setItem(STORAGE_INITIALIZED_KEY, "true");
    }
  };

  useEffect(() => {
    // Inicializa o storage se necessário
    initializeStorage();
    
    // Verifica se o usuário está autenticado
    const authUser = localStorage.getItem("currentUser");
    if (authUser) {
      const user = JSON.parse(authUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.username === username);

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

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.isAdmin) return true;
    return currentUser.permissions.includes(permission);
  };

  const changePassword = (oldPassword, newPassword) => {
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
    const updatedUsers = users.map((u) => 
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
      isAdmin,
      initializeStorage
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
