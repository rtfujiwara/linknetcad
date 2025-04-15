
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { useErrorHandling } from "./utils/errorHandlers";

export const useAddUser = (users: User[], setUsers: (users: User[]) => void) => {
  const { toast } = useToast();
  const { logError, showErrorToast } = useErrorHandling();

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
      await syncStorage.setItem("users", updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Usuário adicionado",
        description: `O usuário ${user.name} foi adicionado com sucesso.`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = logError('adicionar usuário', error);
      
      showErrorToast("Erro ao adicionar usuário", 
        `Não foi possível adicionar o usuário. ${errorMessage}`);
      
      return false;
    }
  };

  return { handleAddUser };
};
