import { Client } from "@/types/client";
import { Plan } from "@/types/plan";
import { User } from "@/types/user";
import { syncStorage } from "@/utils/syncStorage";

export const clientManagerUtils = {
  async getClients(): Promise<Client[]> {
    return await syncStorage.getItem<Client[]>("clients", []);
  },

  async saveClients(clients: Client[]): Promise<void> {
    return await syncStorage.setItem("clients", clients);
  },

  async deleteClient(clientId: number): Promise<void> {
    const clients = await this.getClients();
    const updatedClients = clients.filter((client) => client.id !== clientId);
    await this.saveClients(updatedClients);
  },
};

export const planManagerUtils = {
  async getPlans(): Promise<Plan[]> {
    return await syncStorage.getItem<Plan[]>("plans", []);
  },

  async savePlans(plans: Plan[]): Promise<void> {
    return await syncStorage.setItem("plans", plans);
  },

  async deletePlan(planId: number): Promise<void> {
    const plans = await this.getPlans();
    const updatedPlans = plans.filter((plan) => plan.id !== planId);
    await this.savePlans(updatedPlans);
  },
};

// Add to userManagerUtils
export const userManagerUtils = {
  async getUsers(): Promise<User[]> {
    return await syncStorage.getItem<User[]>("users", []);
  },
  
  async saveUsers(users: User[]): Promise<void> {
    return await syncStorage.setItem("users", users);
  }
};
