
import { User, Permission } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { useErrorHandling } from "./utils/errorHandlers";
import { useConnectionCheck } from "./utils/connectionCheck";

export const usePermissionsManagement = (
  users: User[], 
  setUsers: (users: User[]) => void, 
  isOfflineMode: boolean
) => {
  const { toast } = useToast();
  const { logError, showErrorToast } = useErrorHandling();
  const { checkOfflineAccess } = useConnectionCheck(isOfflineMode);

  const handleEditPermissions = async (userId: number, permissions: Permission[]) => {
    if (!checkOfflineAccess("editar permissões")) return false;
    
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      // Busca o usuário para a mensagem de toast
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      
      // Não permitir remover todas as permissões de um usuário admin
      if (user.isAdmin && permissions.length === 0) {
        toast({
          variant: "destructive",
          title: "Operação não permitida",
          description: "Não é possível remover todas as permissões de um administrador.",
        });
        return false;
      }
      
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, permissions } : user
      );
      
      await syncStorage.setItem("users", updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Permissões atualizadas",
        description: `As permissões de ${user.name} foram atualizadas com sucesso.`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = logError('editar permissões', error, userId);
      
      showErrorToast("Erro ao atualizar permissões", 
        `Não foi possível atualizar as permissões. ${errorMessage}`);
      
      return false;
    }
  };

  return { handleEditPermissions };
};
