
import { useState, useEffect } from "react";
import { User, Permission } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { userManagerUtils } from "@/components/admin/managerUtils";

export const useUserManager = () => {
  const { toast } = useToast();
  const { currentUser, changePassword } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [isEditPermissionsDialogOpen, setIsEditPermissionsDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);

  useEffect(() => {
    const savedUsers = userManagerUtils.getUsers();
    setUsers(savedUsers);
  }, []);

  const handleAddUser = (user: User) => {
    const updatedUsers = [...users, user];
    userManagerUtils.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    
    toast({
      title: "Usuário criado",
      description: "O novo usuário foi cadastrado com sucesso",
    });
  };

  const handleChangePassword = (userId: number, currentPassword: string, newPassword: string) => {
    // If the current user is changing their own password, use the context method
    if (userId === currentUser?.id) {
      changePassword(currentPassword, newPassword);
    } else {
      // Admin changing another user's password
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, password: newPassword } : user
      );

      userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);

      toast({
        title: "Senha alterada",
        description: `A senha do usuário foi alterada com sucesso`,
      });
    }

    setIsChangePasswordDialogOpen(false);
    setSelectedUser(null);
  };

  const handleEditPermissions = (userId: number, newPermissions: Permission[]) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, permissions: newPermissions } : user
    );

    userManagerUtils.saveUsers(updatedUsers);
    setUsers(updatedUsers);

    // Update current user in local storage if the edited user is the current user
    if (userId === currentUser?.id) {
      const updatedCurrentUser = { ...currentUser, permissions: newPermissions };
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
    }

    toast({
      title: "Permissões atualizadas",
      description: `As permissões do usuário foram atualizadas com sucesso`,
    });

    setIsEditPermissionsDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;

    // Prevent deleting yourself
    if (userId === currentUser?.id) {
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
    if (userToDelete.isAdmin && !currentUser?.isAdmin) {
      toast({
        variant: "destructive",
        title: "Operação não permitida",
        description: "Você não tem permissão para excluir um administrador",
      });
      setIsDeleteUserDialogOpen(false);
      setSelectedUser(null);
      return;
    }

    const updatedUsers = users.filter((user) => user.id !== userId);
    userManagerUtils.saveUsers(updatedUsers);
    setUsers(updatedUsers);

    toast({
      title: "Usuário excluído",
      description: `O usuário foi excluído com sucesso`,
    });

    setIsDeleteUserDialogOpen(false);
    setSelectedUser(null);
  };

  const openChangePasswordDialog = (user: User) => {
    setSelectedUser(user);
    setIsChangePasswordDialogOpen(true);
  };

  const openEditPermissionsDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditPermissionsDialogOpen(true);
  };

  const openDeleteUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  return {
    users,
    selectedUser,
    isChangePasswordDialogOpen,
    isEditPermissionsDialogOpen,
    isDeleteUserDialogOpen,
    setIsChangePasswordDialogOpen,
    setIsEditPermissionsDialogOpen,
    setIsDeleteUserDialogOpen,
    handleAddUser,
    handleChangePassword,
    handleEditPermissions,
    handleDeleteUser,
    openChangePasswordDialog,
    openEditPermissionsDialog,
    openDeleteUserDialog,
  };
};
