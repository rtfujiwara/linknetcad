
import { useToast } from "@/components/ui/use-toast";

/**
 * Formats an error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    console.error('Erro desconhecido:', error);
    return 'Ocorreu um erro desconhecido';
  }
};

/**
 * Hook to provide error logging and toast functionality
 */
export const useErrorHandling = () => {
  const { toast } = useToast();

  const logError = (operation: string, error: unknown, userId?: number) => {
    const errorMessage = formatErrorMessage(error);
    const userInfo = userId ? `userId: ${userId}` : 'novo usuário';
    console.error(`Erro na operação "${operation}" (${userInfo}):`, error);
    
    return errorMessage;
  };

  const showErrorToast = (title: string, errorMessage: string) => {
    toast({
      variant: "destructive",
      title,
      description: errorMessage,
    });
  };

  return {
    logError,
    showErrorToast
  };
};
