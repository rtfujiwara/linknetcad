
import { syncStorage } from "@/utils/syncStorage";
import { Plan } from "@/types/plan";
import { User } from "@/types/user";

export const planManagerUtils = {
  getPlans: async (): Promise<Plan[]> => {
    try {
      // Verifica a conexão primeiro
      const isConnected = await syncStorage.checkConnection();
      if (!isConnected) {
        console.warn("Conexão não disponível, usando dados locais");
        return syncStorage.getItemSync<Plan[]>("plans", []);
      }
      
      // Obtém os planos
      return await syncStorage.getItem<Plan[]>("plans", []);
    } catch (error) {
      console.error("Erro ao obter planos:", error);
      throw error;
    }
  },
  
  getPlansSync: (): Plan[] => {
    return syncStorage.getItemSync<Plan[]>("plans", []);
  },
  
  savePlans: async (plans: Plan[]): Promise<void> => {
    try {
      // Tenta salvar os planos, mesmo que offline (serão sincronizados depois)
      await syncStorage.setItem("plans", plans);
    } catch (error) {
      console.error("Erro ao salvar planos:", error);
      throw error;
    }
  }
};

export const userManagerUtils = {
  getUsers: async (): Promise<User[]> => {
    try {
      // Verifica a conexão primeiro
      const isConnected = await syncStorage.checkConnection();
      if (!isConnected) {
        console.warn("Conexão não disponível, usando dados locais");
        return syncStorage.getItemSync<User[]>("users", []);
      }
      
      // Obtém os usuários
      return await syncStorage.getItem<User[]>("users", []);
    } catch (error) {
      console.error("Erro ao obter usuários:", error);
      throw error;
    }
  },

  getUsersSync: (): User[] => {
    return syncStorage.getItemSync<User[]>("users", []);
  },
  
  saveUsers: async (users: User[]): Promise<void> => {
    try {
      // Tenta salvar os usuários, mesmo que offline (serão sincronizados depois)
      await syncStorage.setItem("users", users);
    } catch (error) {
      console.error("Erro ao salvar usuários:", error);
      throw error;
    }
  }
};
