
import { User, Permission } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { userManagerUtils } from "@/components/admin/managerUtils";

export const useUserOperations = (users: User[], setUsers: (users: User[]) => void, currentUser: User | null, isOfflineMode: boolean) => {
  const { toast } = useToast();

  // Helper to format error messages
  const formatErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else {
      console.error('Erro desconhecido:', error);
      return 'Ocorreu um erro desconhecido';
    }
  };

  // Helper to log errors
  const logError = (operation: string, error: unknown, userId?: number) => {
    const errorMessage = formatErrorMessage(error);
    const userInfo = userId ? `userId: ${userId}` : 'novo usuário';
    console.error(`Erro na operação "${operation}" (${userInfo}):`, error);
    
    // Return formatted message for toast
    return errorMessage;
  };

  const checkOfflineAccess = (operation: string): boolean => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Acesso offline não permitido",
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
      
      // Verificar se já existe um usuário com o mesmo nome de usuário
      const userExists = users.some(u => u.username === user.username);
      if (userExists) {
        toast({
          variant: "destructive",
          title: "Usuário já existe",
          description: `Já existe um usuário com o nome '${user.username}'. Escolha outro nome de usuário.`,
        });
        return false;
      }
      
      // Adiciona o usuário
      const updatedUsers = [...users, user];
      await userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Usuário adicionado",
        description: `O usuário ${user.name} foi adicionado com sucesso.`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = logError('adicionar usuário', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao adicionar usuário",
        description: `Não foi possível adicionar o usuário. ${errorMessage}`,
      });
      
      return false;
    }
  };

  const handleChangePassword = async (userId: number, newPassword: string) => {
    if (!checkOfflineAccess("alterar senhas")) return false;
    
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      // Busca o usuário para a mensagem de toast
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      
      // Validação de senha
      if (!newPassword || newPassword.length < 4) {
        toast({
          variant: "destructive",
          title: "Senha inválida",
          description: "A nova senha deve ter pelo menos 4 caracteres.",
        });
        return false;
      }
      
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, password: newPassword } : user
      );
      
      await userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Senha alterada",
        description: `A senha de ${user.name} foi alterada com sucesso.`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = logError('alterar senha', error, userId);
      
      toast({
        variant: "destructive",
        title: "Erro ao alterar senha",
        description: `Não foi possível alterar a senha. ${errorMessage}`,
      });
      
      return false;
    }
  };

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
      
      await userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Permissões atualizadas",
        description: `As permissões de ${user.name} foram atualizadas com sucesso.`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = logError('editar permissões', error, userId);
      
      toast({
        variant: "destructive",
        title: "Erro ao atualizar permissões",
        description: `Não foi possível atualizar as permissões. ${errorMessage}`,
      });
      
      return false;
    }
  };

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
      await userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Usuário excluído",
        description: `O usuário ${userToDelete.name} foi excluído com sucesso.`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = logError('excluir usuário', error, userId);
      
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: `Não foi possível excluir o usuário. ${errorMessage}`,
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
