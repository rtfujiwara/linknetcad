
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";

interface LoginFormProps {
  showCreateAdmin: boolean;
  isOfflineMode: boolean;
  onRetryConnection: () => void;
}

export const LoginForm = ({ showCreateAdmin, isOfflineMode, onRetryConnection }: LoginFormProps) => {
  const [credentials, setCredentials] = useState({ username: "admin", password: "admin" });
  const { login } = useAuth();
  const { toast } = useToast();

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
          permissions: ["view_clients", "edit_clients", "print_clients", "delete_data", "manage_plans", "manage_users"]
        };
        
        await syncStorage.setItem("users", [adminUser]);
        toast({
          title: "Administrador criado",
          description: "O usuário administrador foi criado com sucesso",
        });
        login(credentials.username, credentials.password);
      } else {
        // Tentar conexão automática antes do login
        try {
          // Silenciosamente tenta reconectar antes de logar
          await onRetryConnection();
        } catch (error) {
          console.error("Falha na tentativa automática de reconexão:", error);
          // Continua com o login mesmo se a reconexão falhar
        }
        
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {showCreateAdmin && (
        <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
          <p>Bem-vindo ao primeiro acesso! Crie um usuário e senha para o administrador do sistema.</p>
        </div>
      )}

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
          placeholder="Digite seu usuário"
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
          placeholder="Digite sua senha"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        {showCreateAdmin ? "Criar Administrador" : "Entrar"}
      </Button>
    </form>
  );
};
