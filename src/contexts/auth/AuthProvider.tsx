
import React, { useState } from "react";
import { AuthContextData } from "./types";
import { User, Permission } from "@/types/user";
import { AuthLoading } from "@/components/auth/AuthLoading";
import { useAuthState } from "./useAuthState";
import { authActions } from "./authActions";
import { useUserChangeListener } from "./useUserChangeListener";
import { useAuthInit } from "./useAuthInit";

// Cria o contexto de autenticação
const AuthContext = React.createContext<AuthContextData | undefined>(undefined);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = React.useContext(AuthContext);
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
  // Flag para controlar a inicialização única
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Usa o hook de estado para gerenciar o estado de autenticação
  const {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    isOfflineMode,
    setIsOfflineMode,
    toast,
    navigate,
    checkConnection,
    initializeDefaultData
  } = useAuthState();

  // Função de logout usando a ação correspondente
  const logout = () => {
    authActions.logout(setCurrentUser, navigate, toast);
  };

  // Função de login usando a ação correspondente
  const login = async (username: string, password: string): Promise<void> => {
    return authActions.login(
      username, 
      password, 
      setCurrentUser, 
      setIsOfflineMode, 
      setIsLoading, 
      navigate, 
      toast
    );
  };

  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (permission: Permission): boolean => {
    return authActions.hasPermission(currentUser, permission);
  };

  // Função para tentar reconectar-se ao Firebase
  const retryConnection = async (): Promise<boolean> => {
    return authActions.retryConnection(setIsLoading, setIsOfflineMode, toast);
  };

  // Usa o hook para inicializar o estado de autenticação
  useAuthInit(
    setCurrentUser,
    setIsLoading,
    setIsOfflineMode,
    checkConnection,
    initializeDefaultData,
    toast
  );

  // Usa o hook para escutar mudanças nos usuários
  useUserChangeListener(currentUser, logout, toast);

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
