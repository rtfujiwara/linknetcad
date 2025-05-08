
import { useState, useEffect } from "react";
import { User } from "@/types/user";
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
      
      // Estabelecer um timeout para garantir que o carregamento não fique travado
      const loadTimeout = setTimeout(() => {
        console.warn("Timeout ao carregar usuários, usando dados locais");
        const localUsers = userManagerUtils.getUsersSync();
        if (localUsers.length > 0) {
          setUsers(localUsers);
          setLoadError("Usando dados locais devido a timeout de carregamento.");
        } else {
          setLoadError("Não foi possível carregar usuários. Verifique sua conexão.");
        }
        setIsLoading(false);
      }, 5000);
      
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
          clearTimeout(loadTimeout);
          setIsLoading(false);
          return;
        }
        
        // Tenta verificar a conexão primeiro
        try {
          await syncStorage.checkConnection();
          console.log("Conexão com o banco de dados verificada com sucesso");
        } catch (connectionError) {
          console.error("Erro na verificação de conexão:", connectionError);
          
          // Tenta usar dados do localStorage como fallback
          const localUsers = userManagerUtils.getUsersSync();
          setUsers(localUsers);
          setLoadError("Usando dados locais devido a problemas de conexão.");
          clearTimeout(loadTimeout);
          setIsLoading(false);
          return;
        }
        
        // Carrega os usuários com timeout
        try {
          const fetchedUsers = await userManagerUtils.getUsers();
          console.log(`${fetchedUsers.length} usuários carregados com sucesso`);
          setUsers(fetchedUsers);
        } catch (error) {
          const errorMessage = formatErrorMessage(error);
          console.error("Erro ao carregar usuários:", error);
          
          setLoadError(errorMessage);
          
          // Tenta carregar do armazenamento local como último recurso
          const localUsers = userManagerUtils.getUsersSync();
          if (localUsers.length > 0) {
            setUsers(localUsers);
            console.log(`${localUsers.length} usuários carregados do armazenamento local como fallback`);
          }
        }
      } catch (error) {
        const errorMessage = formatErrorMessage(error);
        console.error("Erro ao carregar usuários:", error);
        
        setLoadError(errorMessage);
        
        // Tenta carregar do armazenamento local como último recurso
        try {
          const localUsers = userManagerUtils.getUsersSync();
          if (localUsers.length > 0) {
            setUsers(localUsers);
            console.log(`${localUsers.length} usuários carregados do armazenamento local como fallback`);
          }
        } catch (localError) {
          console.error("Falha ao carregar dados locais:", localError);
        }
      } finally {
        clearTimeout(loadTimeout);
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
    
    // Estabelecer um timeout para garantir que o recarregamento não fique travado
    const refreshTimeout = setTimeout(() => {
      console.warn("Timeout ao recarregar usuários");
      setLoadError("Tempo excedido ao atualizar usuários.");
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description: "O tempo foi excedido ao tentar atualizar a lista de usuários. Tente novamente.",
      });
    }, 5000);
    
    try {
      if (isOfflineMode) {
        const localUsers = userManagerUtils.getUsersSync();
        setUsers(localUsers);
        toast({
          variant: "default",
          title: "Modo offline ativo",
          description: "Exibindo dados armazenados localmente.",
        });
        clearTimeout(refreshTimeout);
        setIsLoading(false);
        return;
      }
      
      const isConnected = await syncStorage.checkConnection();
      if (!isConnected) {
        const localUsers = userManagerUtils.getUsersSync();
        setUsers(localUsers);
        setLoadError("Usando dados locais devido a problemas de conexão.");
        
        toast({
          variant: "destructive",
          title: "Problema de conexão",
          description: "Não foi possível conectar ao banco de dados. Exibindo dados locais.",
        });
        clearTimeout(refreshTimeout);
        setIsLoading(false);
        return;
      }
      
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
      
      // Último recurso - usar dados locais
      const localUsers = userManagerUtils.getUsersSync();
      if (localUsers.length > 0) {
        setUsers(localUsers);
      }
    } finally {
      clearTimeout(refreshTimeout);
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
