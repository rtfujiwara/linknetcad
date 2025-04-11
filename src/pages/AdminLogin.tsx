
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { Loader2 } from "lucide-react";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkUsers = async () => {
      setIsLoading(true);
      try {
        const users = await syncStorage.getItem("users", []);
        setShowCreateAdmin(users.length === 0);
      } catch (error) {
        console.error("Erro ao verificar usuários:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro ao verificar os usuários existentes.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkUsers();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
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
        
        await syncStorage.setItem("users", [adminUser]);
        toast({
          title: "Administrador criado",
          description: "O usuário administrador foi criado com sucesso",
        });
        login(credentials.username, credentials.password);
      } else {
        login(credentials.username, credentials.password);
      }
    } catch (error) {
      console.error("Erro ao processar login:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro ao processar o login. Por favor, tente novamente.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-blue-50 to-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden p-4"
    >
      {/* Efeito de fibra óptica */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.2)_0%,rgba(37,99,235,0.3)_100%)]"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[3px] bg-blue-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: Math.random() * 0.7 + 0.3,
              boxShadow: '0 0 15px rgba(59,130,246,0.8)',
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
