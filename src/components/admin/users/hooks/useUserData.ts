
import { useState } from "react";
import { User } from "@/types/user";
import { useUserLoading } from "./userDataHooks/useUserLoading";
import { useUserRefresh } from "./userDataHooks/useUserRefresh";
import { useUserLocalStorage } from "./userDataHooks/useUserLocalStorage";

export const useUserData = (currentUser: User | null, isOfflineMode: boolean) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Use specialized hooks for different functionalities
  const { isLoading, setIsLoading } = useUserLoading();
  const { loadUsersFromStorage } = useUserLocalStorage(setUsers, setLoadError);
  
  // Load users on mount using the specialized hook
  const { refreshUsers } = useUserRefresh(
    users,
    setUsers,
    isOfflineMode,
    isLoading,
    setIsLoading,
    setLoadError,
    loadUsersFromStorage
  );

  return {
    users,
    isLoading,
    loadError,
    setUsers,
    refreshUsers
  };
};
