
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { useErrorHandling } from "../utils/errorHandlers";
import { useConnectionCheck } from "../utils/connectionCheck";
import { userManagerUtils } from "@/components/admin/managerUtils";

export const usePasswordOperation = (
  users: User[], 
  setUsers: (users: User[]) => void, 
  isOfflineMode: boolean
) => {
  const { toast } = useToast();
  const { logError, showErrorToast } = useErrorHandling();
  const { checkOfflineAccess } = useConnectionCheck(isOfflineMode);

  const handleChangePassword = async (userId: number, currentPassword: string, newPassword: string) => {
    // Mesmo offline, deve permitir que usuários alterem suas próprias senhas
    const isSelfPasswordChange = users.find(u => u.id === userId)?.username === 
      JSON.parse(localStorage.getItem("currentUser") || "{}")?.username;
    
    // Se não é alteração da própria senha, verifica restrições de modo offline
    if (!isSelfPasswordChange && !checkOfflineAccess("alterar senhas")) return false;
    
    try {
      // Verifica a senha atual para o próprio usuário
      if (isSelfPasswordChange && currentPassword) {
        const user = users.find(u => u.id === userId);
        if (user && user.password !== currentPassword) {
          toast({
            variant: "destructive",
            title: "Senha atual incorreta",
            description: "A senha atual informada não confere.",
          });
          return false;
        }
      }
      
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
      
      // Atualiza o usuário na lista de usuários
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, password: newPassword } : user
      );
      
      // Tenta salvar com múltiplas tentativas
      let saved = false;
      for (let i = 0; i < 3 && !saved; i++) {
        try {
          // Se estamos online, tenta salvar no Firebase
          if (!isOfflineMode) {
            await userManagerUtils.saveUsers(updatedUsers);
            saved = true;
          } else if (isSelfPasswordChange) {
            // Mesmo offline, permite salvar localmente se for a própria senha
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            
            // Atualiza também no currentUser para manter consistência
            const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
            if (currentUser && currentUser.id === userId) {
              currentUser.password = newPassword;
              localStorage.setItem("currentUser", JSON.stringify(currentUser));
            }
            
            saved = true;
          } else {
            throw new Error("Não é possível alterar senhas de outros usuários em modo offline");
          }
        } catch (e) {
          if (i === 2) throw e; // Falhou nas três tentativas
          // Tenta reconectar antes da próxima tentativa
          await syncStorage.checkConnection();
        }
      }
      
      // Atualiza o estado local após sucesso
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
