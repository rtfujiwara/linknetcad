
import { User, Permission } from "@/types/user";
import { useAddUserOperation } from "./operations/useAddUserOperation";
import { usePasswordOperation } from "./operations/usePasswordOperation";
import { usePermissionsOperation } from "./operations/usePermissionsOperation";
import { useDeleteUserOperation } from "./operations/useDeleteUserOperation";

export const useUserOperations = (
  users: User[], 
  setUsers: (users: User[]) => void, 
  currentUser: User | null, 
  isOfflineMode: boolean
) => {
  // Import all sub-hooks
  const { handleAddUser } = useAddUserOperation(users, setUsers);
  const { handleChangePassword } = usePasswordOperation(users, setUsers, isOfflineMode);
  const { handleEditPermissions } = usePermissionsOperation(users, setUsers, isOfflineMode);
  const { handleDeleteUser } = useDeleteUserOperation(users, setUsers, currentUser, isOfflineMode);

  // Export all operations
  return {
    handleAddUser,
    handleChangePassword,
    handleEditPermissions,
    handleDeleteUser
  };
};
