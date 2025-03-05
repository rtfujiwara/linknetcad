
import { useState } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, PenSquare, KeyRound } from "lucide-react";

const PERMISSIONS = [
  { value: "view_clients", label: "Visualizar Clientes" },
  { value: "edit_clients", label: "Editar Clientes" },
  { value: "print_clients", label: "Imprimir Documentos" },
  { value: "manage_plans", label: "Gerenciar Planos" },
  { value: "manage_users", label: "Gerenciar Usuários" },
  { value: "delete_data", label: "Excluir Dados" },
];

export const UsersManager = () => {
  const { currentUser, changePassword, hasPermission } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState(() => 
    JSON.parse(localStorage.getItem("users") || "[]")
  );
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    permissions: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [isEditPermissionsDialogOpen, setIsEditPermissionsDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [editPermissions, setEditPermissions] = useState([]);

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

    const user = {
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

  const togglePermission = (permission) => {
    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const toggleEditPermission = (permission) => {
    setEditPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
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

  const openChangePasswordDialog = (user) => {
    setSelectedUser(user);
    setIsChangePasswordDialogOpen(true);
  };

  const openEditPermissionsDialog = (user) => {
    setSelectedUser(user);
    setEditPermissions([...user.permissions]);
    setIsEditPermissionsDialogOpen(true);
  };

  const openDeleteUserDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  const handleEditPermissions = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, permissions: editPermissions } 
        : user
    );
    
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Update current user in local storage if the edited user is the current user
    if (selectedUser.id === currentUser?.id) {
      const updatedCurrentUser = { ...currentUser, permissions: editPermissions };
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
    }
    
    toast({
      title: "Permissões atualizadas",
      description: `As permissões do usuário ${selectedUser.name} foram atualizadas com sucesso`,
    });
    
    setIsEditPermissionsDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    // Prevent deleting yourself
    if (selectedUser.id === currentUser?.id) {
      toast({
        variant: "destructive",
        title: "Operação não permitida",
        description: "Você não pode excluir seu próprio usuário",
      });
      setIsDeleteUserDialogOpen(false);
      setSelectedUser(null);
      return;
    }

    // Prevent deleting admin users if you're not an admin
    if (selectedUser.isAdmin && !currentUser?.isAdmin) {
      toast({
        variant: "destructive",
        title: "Operação não permitida",
        description: "Você não tem permissão para excluir um administrador",
      });
      setIsDeleteUserDialogOpen(false);
      setSelectedUser(null);
      return;
    }

    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    toast({
      title: "Usuário excluído",
      description: `O usuário ${selectedUser.name} foi excluído com sucesso`,
    });
    
    setIsDeleteUserDialogOpen(false);
    setSelectedUser(null);
  };

  const canManageUsers = currentUser?.isAdmin || hasPermission("manage_users");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
        {canManageUsers && (
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
        )}
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
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {PERMISSIONS.find(p => p.value === permission)?.label || permission}
                        </span>
                      ))}
                      {user.isAdmin && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          Administrador
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openChangePasswordDialog(user)}
                      >
                        <KeyRound className="h-4 w-4 mr-1" />
                        Senha
                      </Button>
                      {canManageUsers && !user.isAdmin && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditPermissionsDialog(user)}
                          >
                            <PenSquare className="h-4 w-4 mr-1" />
                            Permissões
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteUserDialog(user)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Dialog de mudança de senha */}
      <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha - {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedUser?.id === currentUser?.id && (
              <div>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
            )}
            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
            <Button onClick={handleChangePassword} className="w-full">
              Alterar Senha
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de edição de permissões */}
      <Dialog open={isEditPermissionsDialogOpen} onOpenChange={setIsEditPermissionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Permissões - {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Permissões</Label>
              <div className="grid grid-cols-1 gap-2">
                {PERMISSIONS.map(permission => (
                  <div key={permission.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${permission.value}`}
                      checked={editPermissions.includes(permission.value)}
                      onCheckedChange={() => toggleEditPermission(permission.value)}
                    />
                    <label htmlFor={`edit-${permission.value}`}>{permission.label}</label>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleEditPermissions} className="w-full">
              Salvar Permissões
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteUserDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                className="flex-1"
              >
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
