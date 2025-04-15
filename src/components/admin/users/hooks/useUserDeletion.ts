
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { useErrorHandling } from "./utils/errorHandlers";
import { useConnectionCheck } from "./utils/connectionCheck";

export const useUserDeletion = (
  users: User[], 
  setUsers: (users: User[]) => void, 
  currentUser: User | null,
  isOfflineMode: boolean
) => {
  const { toast } = useToast();
  const { logError, showErrorToast } = useErrorHandling();
  const { checkOfflineAccess } = useConnectionCheck(isOfflineMode);

  const handleDeleteUser = async (userId: number) => {
    if (!checkOfflineAccess("excluir usuários")) return false;
    
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      // Verificações adicionais
      if (userId === currentUser?.id) {
        toast({
          variant: "destructive",
          title: "Operação não permitida",
          description: "Você não pode excluir seu próprio usuário.",
        });
        return false;
      }
      
      // Busca o usuário para a mensagem de toast
      const userToDelete = users.find(u => u.id === userId);
      if (!userToDelete) {
        throw new Error("Usuário não encontrado");
      }
      
      // Prevenção para não excluir o último admin
      const isLastAdmin = userToDelete.isAdmin && 
                        users.filter(u => u.isAdmin).length <= 1;
      
      if (isLastAdmin) {
        toast({
          variant: "destructive",
          title: "Operação não permitida",
          description: "Não é possível excluir o único usuário administrador do sistema.",
        });
        return false;
      }
      
      const updatedUsers = users.filter((user) => user.id !== userId);
      await syncStorage.setItem("users", updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Usuário excluído",
        description: `O usuário ${userToDelete.name} foi excluído com sucesso.`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = logError('excluir usuário', error, userId);
      
      showErrorToast("Erro ao excluir usuário", 
        `Não foi possível excluir o usuário. ${errorMessage}`);
      
      return false;
    }
  };

  return { handleDeleteUser };
};
