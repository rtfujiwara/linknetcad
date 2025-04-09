
import { Permission } from "@/types/user";

export const PERMISSIONS: { value: Permission; label: string }[] = [
  { value: "view_clients", label: "Visualizar Clientes" },
  { value: "edit_clients", label: "Editar Clientes" },
  { value: "print_clients", label: "Imprimir Documentos" },
  { value: "manage_plans", label: "Gerenciar Planos" },
  { value: "manage_users", label: "Gerenciar Usuários" },
  { value: "delete_data", label: "Excluir Dados" },
];

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NewUserFormData {
  username: string;
  password: string;
  name: string;
  permissions: Permission[];
}
