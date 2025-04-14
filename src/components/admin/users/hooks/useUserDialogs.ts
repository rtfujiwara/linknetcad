
import { useState } from "react";
import { User } from "@/types/user";

export const useUserDialogs = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [isEditPermissionsDialogOpen, setIsEditPermissionsDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);

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
  };
};
