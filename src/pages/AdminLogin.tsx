
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
      className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden p-4"
    >
      {/* Efeito de fibra óptica */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,190,255,0.3)_0%,rgba(0,50,150,0.6)_100%)]"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[2px] bg-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: Math.random() * 0.5 + 0.2,
              boxShadow: '0 0 10px rgba(120,190,255,0.8)',
            }}
          ></div>
        ))}
      </div>

      <div className="relative h-screen flex flex-col items-center justify-center">
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
            className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-8"
          >
            <h1 className="text-2xl font-semibold text-center mb-6 text-white">
              {showCreateAdmin ? "Criar Primeiro Administrador" : "Acesso Administrativo"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Usuário</Label>
                <Input
                  id="username"
                  required
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="bg-white/20 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="bg-white/20 border-white/20 text-white placeholder:text-white/50"
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
