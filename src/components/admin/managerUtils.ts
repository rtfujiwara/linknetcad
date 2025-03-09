
import { syncStorage } from "@/utils/syncStorage";
import { Plan } from "@/types/plan";
import { User } from "@/types/user";

export const planManagerUtils = {
  getPlans: (): Plan[] => {
    return syncStorage.getItem<Plan[]>("plans", []);
  },
  
  savePlans: (plans: Plan[]): void => {
    syncStorage.setItem("plans", plans);
  }
};

export const userManagerUtils = {
  getUsers: (): User[] => {
    return syncStorage.getItem<User[]>("users", []);
  },
  
  saveUsers: (users: User[]): void => {
    syncStorage.setItem("users", users);
  }
};
