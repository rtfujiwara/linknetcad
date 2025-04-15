
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { useErrorHandling } from "./utils/errorHandlers";
import { useConnectionCheck } from "./utils/connectionCheck";
import { userManagerUtils } from "@/components/admin/managerUtils";

export const usePasswordManagement = (
  users: User[], 
  setUsers: (users: User[]) => void, 
  isOfflineMode: boolean
) => {
  const { toast } = useToast();
  const { logError, showErrorToast } = useErrorHandling();
  const { checkOfflineAccess } = useConnectionCheck(isOfflineMode);

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
      
      showErrorToast("Erro ao alterar senha", 
        `Não foi possível alterar a senha. ${errorMessage}`);
      
      return false;
    }
  };

  return { handleChangePassword };
};
