
import { User, Permission } from "@/types/user";
import { syncStorage } from "@/utils/syncStorage";
import { userManagerUtils } from "@/components/admin/managerUtils";

// Credenciais padrão de administrador
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin";

/**
 * Actions for authentication
 */
export const authActions = {
  /**
   * Login a user
   */
  login: async (
    username: string, 
    password: string, 
    setCurrentUser: (user: User) => void,
    setIsOfflineMode: (isOffline: boolean) => void,
    setIsLoading: (isLoading: boolean) => void,
    navigate: (path: string) => void,
    toast: any
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Tenta verificar a conexão com o Firebase
      let isOnline = false;
      try {
        isOnline = await syncStorage.checkConnection();
        setIsOfflineMode(!isOnline);
      } catch (error) {
        console.warn("Funcionando em modo offline:", error);
        setIsOfflineMode(true);
      }

      // Obtém a lista de usuários
      let users: User[] = [];
      let adminUserFound = false;
      
      try {
        users = await userManagerUtils.getUsers();
        console.log("Usuários carregados do servidor com sucesso");
        
        // Verifica se existe algum usuário admin
        adminUserFound = users.some(u => u.isAdmin);
      } catch (error) {
        console.error("Erro ao obter usuários do servidor:", error);
        
        // Em caso de erro, tenta usar os dados do localStorage
        try {
          users = userManagerUtils.getUsersSync();
          console.log("Usuários carregados do localStorage");
          adminUserFound = users.some(u => u.isAdmin);
        } catch (err) {
          console.error("Erro ao obter usuários do localStorage:", err);
        }
      }
      
      // Se estamos em modo offline e utilizando credenciais padrão
      if (!isOnline && username === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD) {
        // Cria um usuário admin padrão temporário para acesso offline
        const adminUser: User = {
          id: 1,
          username: DEFAULT_ADMIN_USERNAME,
          password: DEFAULT_ADMIN_PASSWORD,
          name: "Administrador",
          isAdmin: true,
          permissions: ["view_clients", "edit_clients", "print_clients", "delete_data", "manage_plans", "manage_users"]
        };
        
        // Armazena o admin temporário no localStorage para uso offline
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        setCurrentUser(adminUser);
        
        toast({
          title: "Login realizado em modo offline",
          description: "Você está utilizando o acesso de emergência. Algumas funcionalidades podem estar limitadas.",
        });
        
        navigate("/admin/dashboard");
        return;
      }
      
      // Se não há usuários cadastrados e são credenciais padrão
      if (users.length === 0 && username === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD) {
        // Cria um usuário admin padrão
        const adminUser: User = {
          id: 1,
          username: DEFAULT_ADMIN_USERNAME,
          password: DEFAULT_ADMIN_PASSWORD,
          name: "Administrador",
          isAdmin: true,
          permissions: ["view_clients", "edit_clients", "print_clients", "delete_data", "manage_plans", "manage_users"]
        };
        
        users = [adminUser];
        
        // Tenta salvar o usuário admin no localStorage
        try {
          await syncStorage.setItem("users", users);
          console.log("Usuário admin salvo com sucesso");
        } catch (e) {
          console.error("Erro ao salvar usuário admin:", e);
          // Mesmo com erro, permite login no modo offline
          localStorage.setItem("users", JSON.stringify(users));
        }
        
        setCurrentUser(adminUser);
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        
        toast({
          title: "Primeiro acesso realizado",
          description: "Conta de administrador criada com sucesso.",
        });
        
        navigate("/admin/dashboard");
        return;
      }
      
      // Procura por um usuário com o nome de usuário e senha fornecidos
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        setCurrentUser(user);
        
        // Armazena o usuário no localStorage para persistência entre reloads
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema de administração.",
        });
        
        navigate("/admin/dashboard");
      } else {
        throw new Error("Usuário ou senha inválidos");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: error instanceof Error ? error.message : "Usuário ou senha incorretos.",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  },

  /**
   * Logout a user
   */
  logout: (
    setCurrentUser: (user: User | null) => void,
    navigate: (path: string) => void,
    toast: any
  ) => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigate("/admin");
    
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso.",
    });
  },

  /**
   * Check if the user has a specific permission
   */
  hasPermission: (currentUser: User | null, permission: Permission): boolean => {
    if (!currentUser) return false;
    return (
      currentUser.isAdmin ||
      (currentUser.permissions && currentUser.permissions.includes(permission))
    );
  },

  /**
   * Retry connection to Firebase
   */
  retryConnection: async (
    setIsLoading: (isLoading: boolean) => void,
    setIsOfflineMode: (isOffline: boolean) => void,
    toast: any
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await syncStorage.checkConnection();
      setIsOfflineMode(false);
      
      toast({
        title: "Conexão restabelecida",
        description: "A conexão com o servidor foi restabelecida com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao tentar reconectar:", error);
      setIsOfflineMode(true);
      
      toast({
        variant: "destructive",
        title: "Falha na conexão",
        description: "Não foi possível conectar ao servidor. Continuando em modo offline.",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }
};
