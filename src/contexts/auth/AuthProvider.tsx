
import React, { createContext, useContext } from "react";
import { AuthContextData } from "./types";
import { useAuthProvider } from "./useAuthProvider";
import { AuthLoading } from "@/components/auth/AuthLoading";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authProviderData = useAuthProvider();
  
  if (authProviderData.isLoading) {
    return <AuthLoading />;
  }

  return (
    <AuthContext.Provider value={authProviderData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
