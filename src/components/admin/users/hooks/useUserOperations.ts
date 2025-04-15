
import { User, Permission } from "@/types/user";
import { useAddUser } from "./useAddUser";
import { usePasswordManagement } from "./usePasswordManagement";
import { usePermissionsManagement } from "./usePermissionsManagement";
import { useUserDeletion } from "./useUserDeletion";

export const useUserOperations = (
  users: User[], 
  setUsers: (users: User[]) => void, 
  currentUser: User | null, 
  isOfflineMode: boolean
) => {
  // Import all sub-hooks
  const { handleAddUser } = useAddUser(users, setUsers);
  const { handleChangePassword } = usePasswordManagement(users, setUsers, isOfflineMode);
  const { handleEditPermissions } = usePermissionsManagement(users, setUsers, isOfflineMode);
  const { handleDeleteUser } = useUserDeletion(users, setUsers, currentUser, isOfflineMode);

  // Export all operations
  return {
    handleAddUser,
    handleChangePassword,
    handleEditPermissions,
    handleDeleteUser
  };
};
