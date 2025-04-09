
import { useAuth } from "@/contexts/AuthContext";
import { AddUserDialog } from "./users/AddUserDialog";
import { ChangePasswordDialog } from "./users/ChangePasswordDialog";
import { EditPermissionsDialog } from "./users/EditPermissionsDialog";
import { DeleteUserDialog } from "./users/DeleteUserDialog";
import { UsersTable } from "./users/UsersTable";
import { useUserManager } from "./users/useUserManager";

export const UsersManager = () => {
  const { currentUser, hasPermission } = useAuth();
  const {
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
  } = useUserManager();
  
  const canManageUsers = currentUser?.isAdmin || hasPermission("manage_users");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
        {canManageUsers && <AddUserDialog onAddUser={handleAddUser} />}
      </div>

      <UsersTable
        users={users}
        currentUserId={currentUser?.id}
        canManageUsers={canManageUsers}
        onChangePassword={openChangePasswordDialog}
        onEditPermissions={openEditPermissionsDialog}
        onDeleteUser={openDeleteUserDialog}
      />

      <ChangePasswordDialog
        isOpen={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
        selectedUser={selectedUser}
        currentUserId={currentUser?.id}
        onChangePassword={handleChangePassword}
      />

      <EditPermissionsDialog
        isOpen={isEditPermissionsDialogOpen}
        onOpenChange={setIsEditPermissionsDialogOpen}
        selectedUser={selectedUser}
        onSavePermissions={handleEditPermissions}
      />

      <DeleteUserDialog
        isOpen={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
        selectedUser={selectedUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};
