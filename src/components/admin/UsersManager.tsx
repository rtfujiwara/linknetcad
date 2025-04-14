
import { useAuth } from "@/contexts/AuthContext";
import { AddUserDialog } from "./users/AddUserDialog";
import { ChangePasswordDialog } from "./users/ChangePasswordDialog";
import { EditPermissionsDialog } from "./users/EditPermissionsDialog";
import { DeleteUserDialog } from "./users/DeleteUserDialog";
import { UsersTable } from "./users/UsersTable";
import { useUserManager } from "./users/useUserManager";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertCircle, WifiOff } from "lucide-react";

export const UsersManager = () => {
  const { currentUser, hasPermission, isOfflineMode } = useAuth();
  const {
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
    openChangePasswordDialog,
    openEditPermissionsDialog,
    openDeleteUserDialog,
  } = useUserManager();
  
  const canManageUsers = currentUser?.isAdmin || hasPermission("manage_users");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshUsers} 
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Carregando...' : 'Atualizar'}
          </Button>
          {canManageUsers && <AddUserDialog onAddUser={handleAddUser} />}
        </div>
      </div>

      {isOfflineMode && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <WifiOff className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Modo Offline Ativo</AlertTitle>
          <AlertDescription className="text-amber-700">
            O sistema está operando em modo offline. Algumas funcionalidades estão limitadas e os dados podem não estar atualizados.
          </AlertDescription>
        </Alert>
      )}

      {loadError && (
        <Alert variant="destructive" className="bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Problema ao carregar usuários</AlertTitle>
          <AlertDescription>
            {loadError}
          </AlertDescription>
        </Alert>
      )}

      <UsersTable
        users={users}
        currentUserId={currentUser?.id}
        canManageUsers={canManageUsers}
        onChangePassword={openChangePasswordDialog}
        onEditPermissions={openEditPermissionsDialog}
        onDeleteUser={openDeleteUserDialog}
        isLoading={isLoading}
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
