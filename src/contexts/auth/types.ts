
import { User, Permission } from "@/types/user";

export interface AuthContextData {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isOfflineMode: boolean;
  retryConnection: () => Promise<boolean>;
  isLoading?: boolean;
}
