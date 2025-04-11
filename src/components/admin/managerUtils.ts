
import { syncStorage } from "@/utils/syncStorage";
import { Plan } from "@/types/plan";
import { User } from "@/types/user";

export const planManagerUtils = {
  getPlans: async (): Promise<Plan[]> => {
    return await syncStorage.getItem<Plan[]>("plans", []);
  },
  
  getPlansSync: (): Plan[] => {
    return syncStorage.getItemSync<Plan[]>("plans", []);
  },
  
  savePlans: (plans: Plan[]): void => {
    syncStorage.setItem("plans", plans);
  }
};

export const userManagerUtils = {
  getUsers: async (): Promise<User[]> => {
    return await syncStorage.getItem<User[]>("users", []);
  },

  getUsersSync: (): User[] => {
    return syncStorage.getItemSync<User[]>("users", []);
  },
  
  saveUsers: (users: User[]): void => {
    syncStorage.setItem("users", users);
  }
};
