
import React from "react";
import { motion } from "framer-motion";
import { LoginForm } from "./LoginForm";

interface LoginContainerProps {
  showCreateAdmin: boolean;
  isOfflineMode: boolean;
  onRetryConnection: () => void;
}

export const LoginContainer = ({ 
  showCreateAdmin, 
  isOfflineMode, 
  onRetryConnection 
}: LoginContainerProps) => {
  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className="bg-white/30 backdrop-blur-sm rounded-lg shadow-lg p-8"
    >
      <h1 className="text-2xl font-semibold text-center mb-6 text-blue-900">
        {showCreateAdmin ? "Criar Primeiro Administrador" : "Acesso Administrativo"}
      </h1>
      
      <LoginForm 
        showCreateAdmin={showCreateAdmin} 
        isOfflineMode={isOfflineMode}
        onRetryConnection={onRetryConnection} 
      />
    </motion.div>
  );
};
