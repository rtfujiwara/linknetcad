import { useState, useEffect } from "react";
import { User, Permission } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { userManagerUtils } from "@/components/admin/managerUtils";
import { syncStorage } from "@/utils/syncStorage";

export const useUserManager = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [isEditPermissionsDialogOpen, setIsEditPermissionsDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Timeout ao carregar usuários")), 10000);
        });
        
        const usersPromise = userManagerUtils.getUsers();
        
        const fetchedUsers = await Promise.race([usersPromise, timeoutPromise]);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        const localUsers = userManagerUtils.getUsersSync();
        setUsers(localUsers);
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: "Não foi possível carregar todos os usuários. Funcionando com dados locais.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
    
    const unsubscribe = syncStorage.addChangeListener((key, value) => {
      if (key === "users") {
        setUsers(value || []);
      }
    });
    
    return () => unsubscribe();
  }, [toast]);

  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  const openChangePasswordDialog = (user: User) => {
    setSelectedUser(user);
    setIsChangePasswordDialogOpen(true);
  };

  const openEditPermissionsDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditPermissionsDialogOpen(true);
  };

  const openDeleteUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  const handleChangePassword = async (userId: number, newPassword: string) => {
    try {
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, password: newPassword } : user
      );
      
      userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setIsChangePasswordDialogOpen(false);
      
      toast({
        title: "Senha alterada",
        description: "A senha foi alterada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao alterar a senha",
      });
    }
  };

  const handleEditPermissions = async (userId: number, permissions: Permission[]) => {
    try {
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, permissions } : user
      );
      
      userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setIsEditPermissionsDialogOpen(false);
      
      toast({
        title: "Permissões atualizadas",
        description: "As permissões foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar permissões:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao atualizar as permissões",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      if (userId === currentUser?.id) {
        toast({
          variant: "destructive",
          title: "Operação não permitida",
          description: "Você não pode excluir seu próprio usuário",
        });
        return;
      }
      
      const updatedUsers = users.filter((user) => user.id !== userId);
      userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setIsDeleteUserDialogOpen(false);
      
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso",
      });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao excluir o usuário",
      });
    }
  };

  return {
    users,
    isLoading,
    selectedUser,
    isChangePasswordDialogOpen,
    isEditPermissionsDialogOpen,
    isDeleteUserDialogOpen,
    setIsChangePasswordDialogOpen,
    setIsEditPermissionsDialogOpen,
    setIsDeleteUserDialogOpen,
    handleAddUser,
    handleChangePassword,
    handleEditPermissions,
    handleDeleteUser,
    openChangePasswordDialog,
    openEditPermissionsDialog,
    openDeleteUserDialog,
  };
};
