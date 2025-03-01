
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
  const { currentUser, changePassword } = useAuth();
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
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const handleChangePassword = () => {
    if (!selectedUser) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem",
      });
      return;
    }

    if (passwordData.newPassword.length < 4) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve ter pelo menos 4 caracteres",
      });
      return;
    }

    // If the current user is changing their own password, use the context method
    if (selectedUser.id === currentUser?.id) {
      changePassword(passwordData.currentPassword, passwordData.newPassword);
    } else {
      // Admin changing another user's password
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, password: passwordData.newPassword } 
          : user
      );
      
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      toast({
        title: "Senha alterada",
        description: `A senha do usuário ${selectedUser.name} foi alterada com sucesso`,
      });
    }
    
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangePasswordDialogOpen(false);
    setSelectedUser(null);
  };

  const openChangePasswordDialog = (user: User) => {
    setSelectedUser(user);
    setIsChangePasswordDialogOpen(true);
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
              <th className="px-4 py-2 text-left">Ações</th>
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
                  <td className="px-4 py-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openChangePasswordDialog(user)}
                    >
                      Alterar Senha
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha {selectedUser && `- ${selectedUser.name}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Only show current password field if user is changing their own password */}
            {selectedUser?.id === currentUser?.id && (
              <div>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>
            )}
            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>
            <Button onClick={handleChangePassword} className="w-full">
              Salvar Nova Senha
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
