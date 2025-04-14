
import { User, Permission } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { userManagerUtils } from "@/components/admin/managerUtils";

export const useUserOperations = (users: User[], setUsers: (users: User[]) => void, currentUser: User | null, isOfflineMode: boolean) => {
  const { toast } = useToast();

  const checkOfflineAccess = (operation: string): boolean => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: `Não é possível ${operation} sem conexão com o banco de dados.`,
      });
      return false;
    }
    return true;
  };

  const handleAddUser = async (user: User) => {
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      // Adiciona o usuário
      const updatedUsers = [...users, user];
      await userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Usuário adicionado",
        description: "O usuário foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível adicionar o usuário. Verifique sua conexão com a internet.",
      });
    }
  };

  const handleChangePassword = async (userId: number, newPassword: string) => {
    if (!checkOfflineAccess("alterar senhas")) return;
    
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, password: newPassword } : user
      );
      
      await userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Senha alterada",
        description: "A senha foi alterada com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível alterar a senha. Verifique sua conexão com a internet.",
      });
      return false;
    }
  };

  const handleEditPermissions = async (userId: number, permissions: Permission[]) => {
    if (!checkOfflineAccess("editar permissões")) return;
    
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, permissions } : user
      );
      
      await userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Permissões atualizadas",
        description: "As permissões foram atualizadas com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar permissões:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível atualizar as permissões. Verifique sua conexão com a internet.",
      });
      return false;
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!checkOfflineAccess("excluir usuários")) return;
    
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      if (userId === currentUser?.id) {
        toast({
          variant: "destructive",
          title: "Operação não permitida",
          description: "Você não pode excluir seu próprio usuário",
        });
        return false;
      }
      
      const updatedUsers = users.filter((user) => user.id !== userId);
      await userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível excluir o usuário. Verifique sua conexão com a internet.",
      });
      return false;
    }
  };

  return {
    handleAddUser,
    handleChangePassword,
    handleEditPermissions,
    handleDeleteUser
  };
};
