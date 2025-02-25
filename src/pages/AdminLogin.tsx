
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    setShowCreateAdmin(users.length === 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            {showCreateAdmin ? "Criar Primeiro Administrador" : "Acesso Administrativo"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                required
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              {showCreateAdmin ? "Criar Administrador" : "Entrar"}
            </Button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
