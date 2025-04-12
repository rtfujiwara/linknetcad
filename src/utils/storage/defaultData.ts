
/**
 * Default data initialization module
 */
import { User } from "@/types/user";
import { Plan } from "@/types/plan";
import { setItem, getItem, checkConnection } from "./syncManager";

/**
 * Create default admin user
 */
export const createDefaultAdminUser = (): User => {
  return {
    id: 1,
    username: "admin",
    password: "admin",
    name: "Administrador",
    isAdmin: true,
    permissions: ["view_clients", "edit_clients", "print_clients", "delete_data", "manage_plans", "manage_users"]
  };
};

/**
 * Create default plans
 */
export const createDefaultPlans = (): Plan[] => {
  return [
    {
      id: 1,
      name: "Plano Básico",
      price: 79.90,
      description: "Internet de 50 Mbps"
    },
    {
      id: 2,
      name: "Plano Intermediário",
      price: 99.90,
      description: "Internet de 100 Mbps"
    },
    {
      id: 3,
      name: "Plano Premium",
      price: 129.90,
      description: "Internet de 200 Mbps"
    }
  ];
};

/**
 * Initialize default data if none exists
 */
export const initializeDefaultData = async (): Promise<void> => {
  try {
    // Check connection
    await checkConnection();
    
    // Check if users exist
    const users = await getItem<User[]>("users", []);
    if (!users || users.length === 0) {
      // Create default admin user
      const adminUser = createDefaultAdminUser();
      await setItem("users", [adminUser]);
      console.log("Usuário admin padrão criado com sucesso");
    }
    
    // Check if plans exist
    const plans = await getItem<Plan[]>("plans", []);
    if (!plans || plans.length === 0) {
      // Create default plans
      const defaultPlans = createDefaultPlans();
      await setItem("plans", defaultPlans);
      console.log("Planos padrão criados com sucesso");
    }
  } catch (error) {
    console.error("Erro ao inicializar dados padrão:", error);
    throw new Error("Não foi possível inicializar os dados padrão. Verifique sua conexão com a internet.");
  }
};
