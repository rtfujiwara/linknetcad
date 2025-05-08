
import { User } from "@/types/user";
import { userManagerUtils } from "@/components/admin/managerUtils";
import { formatErrorMessage } from "../utils/errorHandlers";

/**
 * Hook for handling local storage operations
 */
export const useUserLocalStorage = (
  setUsers: (users: User[]) => void,
  setLoadError: (error: string | null) => void
) => {
  /**
   * Gets users from local storage
   */
  const loadUsersFromStorage = () => {
    try {
      const localUsers = userManagerUtils.getUsersSync();
      setUsers(localUsers);
      
      if (localUsers.length === 0) {
        setLoadError("Nenhum usuário encontrado no armazenamento local.");
        console.log("Nenhum usuário encontrado no armazenamento local");
      } else {
        console.log(`${localUsers.length} usuários carregados do armazenamento local`);
      }
      return localUsers;
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Erro ao carregar usuários do armazenamento local:", error);
      setLoadError(`Erro ao carregar usuários locais: ${errorMessage}`);
      return [];
    }
  };

  return {
    loadUsersFromStorage
  };
};
