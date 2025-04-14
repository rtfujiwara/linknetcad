
import { useState, useEffect } from "react";
import { User, Permission } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { userManagerUtils } from "@/components/admin/managerUtils";
import { syncStorage } from "@/utils/syncStorage";

export const useUserData = (currentUser: User | null, isOfflineMode: boolean) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        // Verifica a conexão primeiro
        await syncStorage.checkConnection();
        
        // Carrega os usuários
        const fetchedUsers = await userManagerUtils.getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: error instanceof Error ? error.message : "Não foi possível carregar a lista de usuários. Verifique sua conexão com a internet.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
    
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "users") {
        setUsers(value || []);
      }
    });
    
    return () => unsubscribe();
  }, [toast]);

  return {
    users,
    isLoading,
    setUsers
  };
};
