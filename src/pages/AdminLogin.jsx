
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useToast } from "../components/ui/use-toast";
import { FiberOpticBackground } from "../components/admin/FiberOpticBackground";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Verifica se existem usuários no localStorage
    const checkForUsers = () => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      setShowCreateAdmin(users.length === 0);
    };
    
    checkForUsers();
    
    // Adiciona um listener para o evento storage para detectar mudanças em outros navegadores
    window.addEventListener("storage", checkForUsers);
    
    return () => {
      window.removeEventListener("storage", checkForUsers);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showCreateAdmin) {
      // Criar primeiro usuário admin
      const adminUser = {
        id: 1,
        username: credentials.username,
        password: credentials.password,
        name: "Administrador",
        isAdmin: true,
        permissions: ["view_clients", "edit_clients", "print_clients", "manage_plans", "manage_users"]
      };
      
      localStorage.setItem("users", JSON.stringify([adminUser]));
      // Dispara um evento para notificar outros navegadores sobre a mudança
      window.dispatchEvent(new Event("storage"));
      
      toast({
        title: "Administrador criado",
        description: "O usuário administrador foi criado com sucesso",
      });
      login(credentials.username, credentials.password);
    } else {
      login(credentials.username, credentials.password);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden p-4"
    >
      {/* Efeito de fibra óptica */}
      <FiberOpticBackground />

      <div className="relative h-screen flex flex-col items-center justify-center z-10">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src="/lovable-uploads/d03abdb3-b61b-43e7-b5d4-4983ff5fcf27.png"
          alt="Linknet Vale Logo"
          className="w-48 md:w-64 mb-8"
        />

        <div className="w-full max-w-md">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white/30 backdrop-blur-sm rounded-lg shadow-lg p-8"
          >
            <h1 className="text-2xl font-semibold text-center mb-6 text-blue-900">
              {showCreateAdmin ? "Criar Primeiro Administrador" : "Acesso Administrativo"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-900">Usuário</Label>
                <Input
                  id="username"
                  required
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="bg-white/50 border-blue-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-900">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="bg-white/50 border-blue-200"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {showCreateAdmin ? "Criar Administrador" : "Entrar"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
