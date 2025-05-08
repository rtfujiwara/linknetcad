
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { userManagerUtils } from "@/components/admin/managerUtils";
import { useEffect } from "react";
import { formatErrorMessage } from "../utils/errorHandlers";

/**
 * Hook for handling user data refreshing operations
 */
export const useUserRefresh = (
  users: User[],
  setUsers: (users: User[]) => void,
  isOfflineMode: boolean,
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
  setLoadError: (error: string | null) => void,
  loadUsersFromStorage: () => User[]
) => {
  const { toast } = useToast();

  // Load users on mount
  useEffect(() => {
    loadUsers();
    
    // Configurar listener para mudanças de armazenamento
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "users") {
        console.log("Mudança detectada nos usuários, atualizando lista");
        setUsers(value || []);
      }
    });
    
    return () => unsubscribe();
  }, [isOfflineMode]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load users with timeout and error handling
   */
  const loadUsers = async () => {
    setIsLoading(true);
    setLoadError(null);
    
    // Estabelecer um timeout para garantir que o carregamento não fique travado
    const loadTimeout = setTimeout(() => {
      console.warn("Timeout ao carregar usuários, usando dados locais");
      loadUsersFromStorage();
      setLoadError("Usando dados locais devido a timeout de carregamento.");
      setIsLoading(false);
    }, 5000);
    
    try {
      // Verificamos se estamos no modo offline
      if (isOfflineMode) {
        console.log("Carregando usuários em modo offline");
        loadUsersFromStorage();
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
        loadUsersFromStorage();
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
        loadUsersFromStorage();
      }
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Erro ao carregar usuários:", error);
      
      setLoadError(errorMessage);
      
      // Tenta carregar do armazenamento local como último recurso
      loadUsersFromStorage();
    } finally {
      clearTimeout(loadTimeout);
      setIsLoading(false);
    }
  };

  /**
   * Método para forçar o recarregamento dos usuários
   */
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
        loadUsersFromStorage();
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
        loadUsersFromStorage();
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
      loadUsersFromStorage();
    } finally {
      clearTimeout(refreshTimeout);
      setIsLoading(false);
    }
  };

  return { refreshUsers };
};
