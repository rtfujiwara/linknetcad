
import { useAuth } from "@/contexts/AuthContext";
import { useUserDialogs } from "./hooks/useUserDialogs";
import { useUserData } from "./hooks/useUserData";
import { useUserOperations } from "./hooks/useUserOperations";

export const useUserManager = () => {
  const { currentUser, isOfflineMode } = useAuth();
  
  const {
    users,
    isLoading,
    setUsers
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
      return;
    }
    openChangePasswordDialog(user);
  };

  const safeOpenEditPermissionsDialog = (user) => {
    if (isOfflineMode) {
      return;
    }
    openEditPermissionsDialog(user);
  };

  const safeOpenDeleteUserDialog = (user) => {
    if (isOfflineMode) {
      return;
    }
    openDeleteUserDialog(user);
  };

  return {
    users,
    isLoading,
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
    openChangePasswordDialog: safeOpenChangePasswordDialog,
    openEditPermissionsDialog: safeOpenEditPermissionsDialog,
    openDeleteUserDialog: safeOpenDeleteUserDialog,
  };
};
