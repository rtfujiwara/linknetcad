
import { useState } from "react";
import { User, Permission } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PERMISSIONS: { value: Permission; label: string }[] = [
  { value: "view_clients", label: "Visualizar Clientes" },
  { value: "edit_clients", label: "Editar Clientes" },
  { value: "print_clients", label: "Imprimir Documentos" },
  { value: "manage_plans", label: "Gerenciar Planos" },
  { value: "manage_users", label: "Gerenciar Usuários" },
];

export const UsersManager = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(() => 
    JSON.parse(localStorage.getItem("users") || "[]")
  );
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    permissions: [] as Permission[],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    const userExists = users.some(u => u.username === newUser.username);
    if (userExists) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome de usuário já existe",
      });
      return;
    }

    const user: User = {
      id: Date.now(),
      ...newUser,
      isAdmin: false,
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    setNewUser({
      username: "",
      password: "",
      name: "",
      permissions: [],
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Usuário criado",
      description: "O novo usuário foi cadastrado com sucesso",
    });
  };

  const togglePermission = (permission: Permission) => {
    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Usuário</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={e => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Permissões</Label>
                <div className="grid grid-cols-1 gap-2">
                  {PERMISSIONS.map(permission => (
                    <div key={permission.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.value}
                        checked={newUser.permissions.includes(permission.value)}
                        onCheckedChange={() => togglePermission(permission.value)}
                      />
                      <label htmlFor={permission.value}>{permission.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleAddUser} className="w-full">
                Criar Usuário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Usuário</th>
              <th className="px-4 py-2 text-left">Permissões</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(user => currentUser?.isAdmin || !user.isAdmin)
              .map(user => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map(permission => (
                        <span
                          key={permission}
                          className="px-2 py-1 text-xs bg-gray-100 rounded"
                        >
                          {PERMISSIONS.find(p => p.value === permission)?.label}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
