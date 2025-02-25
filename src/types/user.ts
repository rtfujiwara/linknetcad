
export type Permission = 
  | "view_clients"
  | "edit_clients"
  | "print_clients"
  | "manage_plans"
  | "manage_users";

export interface User {
  id: number;
  username: string;
  password: string;
  isAdmin: boolean;
  permissions: Permission[];
  name: string;
}
