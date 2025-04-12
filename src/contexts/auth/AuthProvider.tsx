
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextData } from "./types";
import { User } from "@/types/user";
import { syncStorage } from "@/utils/syncStorage";
import { AuthLoading } from "@/components/auth/AuthLoading";
import { userManagerUtils } from "@/components/admin/managerUtils";

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

  // Verifica a autenticação ao carregar o componente
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Verifica a conexão com o Firebase
        await syncStorage.checkConnection();
        setIsOfflineMode(false);

        // Recupera o usuário atual da sessão
        const storedUser = sessionStorage.getItem("currentUser");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsOfflineMode(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função para fazer login
  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Verifica a conexão com o Firebase
      await syncStorage.checkConnection();
      setIsOfflineMode(false);

      // Obtém a lista de usuários
      const users = await userManagerUtils.getUsers();
      
      // Procura por um usuário com o nome de usuário e senha fornecidos
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Remove a senha do objeto do usuário por segurança
        const { password: _, ...safeUser } = user;
        setCurrentUser(safeUser as User);
        
        // Armazena o usuário na sessão
        sessionStorage.setItem("currentUser", JSON.stringify(safeUser));
      } else {
        throw new Error("Usuário ou senha inválidos");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer logout
  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("currentUser");
  };

  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return (
      currentUser.isAdmin ||
      (currentUser.permissions && currentUser.permissions.includes(permission))
    );
  };

  // Função para verificar se o usuário é um administrador
  const isAdmin = !!currentUser?.isAdmin;

  // Função para tentar reconectar-se ao Firebase
  const retryConnection = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      await syncStorage.checkConnection();
      setIsOfflineMode(false);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Erro ao tentar reconectar:", error);
      setIsOfflineMode(true);
      setIsLoading(false);
      return false;
    }
  };

  // Valores que serão fornecidos pelo contexto
  const authContextValue: AuthContextData = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin,
    login,
    logout,
    hasPermission,
    isOfflineMode,
    retryConnection,
    isLoading,
  };

  if (isLoading) {
    return <AuthLoading />;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
