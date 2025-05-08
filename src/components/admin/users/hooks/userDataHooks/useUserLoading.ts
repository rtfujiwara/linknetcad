
import { useState } from "react";

/**
 * Hook to manage loading state
 */
export const useUserLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  return {
    isLoading,
    setIsLoading
  };
};
