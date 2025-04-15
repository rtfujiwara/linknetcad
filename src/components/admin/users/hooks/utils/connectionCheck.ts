
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook to check if offline operations are allowed
 */
export const useConnectionCheck = (isOfflineMode: boolean) => {
  const { toast } = useToast();

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

  return { checkOfflineAccess };
};
