
import { useState, useEffect } from "react";
import { User, Permission } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { userManagerUtils } from "@/components/admin/managerUtils";
import { syncStorage } from "@/utils/syncStorage";

export const useUserData = (currentUser: User | null, isOfflineMode: boolean) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        // Verificamos se estamos no modo offline
        if (isOfflineMode) {
          console.log("Carregando usuários em modo offline");
          const localUsers = userManagerUtils.getUsersSync();
          setUsers(localUsers);
          
          if (localUsers.length === 0) {
            setLoadError("Nenhum usuário encontrado no armazenamento local.");
          } else {
            console.log(`${localUsers.length} usuários carregados do armazenamento local`);
          }
          return;
        }
        
        // Tenta verificar a conexão primeiro
        try {
          await syncStorage.checkConnection();
          console.log("Conexão com o banco de dados verificada com sucesso");
        } catch (connectionError) {
          console.error("Erro na verificação de conexão:", connectionError);
          toast({
            variant: "destructive",
            title: "Problema de conexão",
            description: "Não foi possível conectar ao banco de dados. Os dados podem estar desatualizados.",
          });
          
          // Tenta usar dados do localStorage como fallback
          const localUsers = userManagerUtils.getUsersSync();
          setUsers(localUsers);
          setLoadError("Usando dados locais devido a problemas de conexão.");
          return;
        }
        
        // Carrega os usuários
        const fetchedUsers = await userManagerUtils.getUsers();
        console.log(`${fetchedUsers.length} usuários carregados com sucesso`);
        setUsers(fetchedUsers);
      } catch (error) {
        const errorMessage = formatErrorMessage(error);
        console.error("Erro ao carregar usuários:", error);
        
        setLoadError(errorMessage);
        
        toast({
          variant: "destructive",
          title: "Erro ao carregar usuários",
          description: `Não foi possível carregar a lista de usuários. ${errorMessage}`,
        });
        
        // Tenta carregar do armazenamento local como último recurso
        try {
          const localUsers = userManagerUtils.getUsersSync();
          if (localUsers.length > 0) {
            setUsers(localUsers);
            console.log(`${localUsers.length} usuários carregados do armazenamento local como fallback`);
            toast({
              title: "Dados locais carregados",
              description: "Usando dados armazenados localmente. Algumas informações podem estar desatualizadas.",
            });
          }
        } catch (localError) {
          console.error("Falha ao carregar dados locais:", localError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
    
    // Configurar listener para mudanças de armazenamento
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "users") {
        console.log("Mudança detectada nos usuários, atualizando lista");
        setUsers(value || []);
      }
    });
    
    return () => unsubscribe();
  }, [toast, isOfflineMode]);

  // Método para forçar o recarregamento dos usuários
  const refreshUsers = async () => {
    setIsLoading(true);
    setLoadError(null);
    
    try {
      await syncStorage.checkConnection();
      const fetchedUsers = await userManagerUtils.getUsers();
      setUsers(fetchedUsers);
      
      toast({
        title: "Lista atualizada",
        description: "A lista de usuários foi atualizada com sucesso.",
      });
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      setLoadError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: `Não foi possível atualizar a lista de usuários. ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    loadError,
    setUsers,
    refreshUsers
  };
};
