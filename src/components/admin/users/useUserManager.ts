
import { useAuth } from "@/contexts/AuthContext";
import { useUserDialogs } from "./hooks/useUserDialogs";
import { useUserData } from "./hooks/useUserData";
import { useUserOperations } from "./hooks/useUserOperations";
import { useToast } from "@/components/ui/use-toast";

export const useUserManager = () => {
  const { currentUser, isOfflineMode } = useAuth();
  const { toast } = useToast();
  
  const {
    users,
    isLoading,
    loadError,
    setUsers,
    refreshUsers
  } = useUserData(currentUser, isOfflineMode);
  
  const {
    selectedUser,
    isChangePasswordDialogOpen,
    isEditPermissionsDialogOpen,
    isDeleteUserDialogOpen,
    setIsChangePasswordDialogOpen,
    setIsEditPermissionsDialogOpen,
    setIsDeleteUserDialogOpen,
    openChangePasswordDialog,
    openEditPermissionsDialog,
    openDeleteUserDialog,
  } = useUserDialogs();
  
  const {
    handleAddUser,
    handleChangePassword,
    handleEditPermissions,
    handleDeleteUser
  } = useUserOperations(users, setUsers, currentUser, isOfflineMode);

  // Wrap dialog openers to check for offline mode
  const safeOpenChangePasswordDialog = (user) => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Modo offline ativo",
        description: "Não é possível alterar senhas no modo offline. Aguarde a conexão ser restabelecida.",
      });
      return;
    }
    openChangePasswordDialog(user);
  };

  const safeOpenEditPermissionsDialog = (user) => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Modo offline ativo",
        description: "Não é possível editar permissões no modo offline. Aguarde a conexão ser restabelecida.",
      });
      return;
    }
    openEditPermissionsDialog(user);
  };

  const safeOpenDeleteUserDialog = (user) => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Modo offline ativo",
        description: "Não é possível excluir usuários no modo offline. Aguarde a conexão ser restabelecida.",
      });
      return;
    }
    openDeleteUserDialog(user);
  };

  return {
    users,
    isLoading,
    loadError,
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
    refreshUsers,
    openChangePasswordDialog: safeOpenChangePasswordDialog,
    openEditPermissionsDialog: safeOpenEditPermissionsDialog,
    openDeleteUserDialog: safeOpenDeleteUserDialog,
  };
};
