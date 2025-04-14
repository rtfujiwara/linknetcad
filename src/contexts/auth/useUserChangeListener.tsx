
import { useEffect } from "react";
import { User } from "@/types/user";
import { syncStorage } from "@/utils/syncStorage";

/**
 * Hook to listen for changes in the user data
 */
export const useUserChangeListener = (
  currentUser: User | null,
  logout: () => void,
  toast: any
) => {
  useEffect(() => {
    // Listener para mudanças nos usuários
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "users" && currentUser) {
        // Verifica se o usuário atual ainda existe após as mudanças
        const userExists = value?.some((user: User) => user.id === currentUser.id);
        if (!userExists) {
          // Se o usuário não existe mais, faz logout
          logout();
          toast({
            title: "Sessão encerrada",
            description: "Seu usuário foi removido por um administrador.",
          });
        }
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser, logout, toast]);
};
