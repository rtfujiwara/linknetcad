
import { useState, useEffect } from "react";
import { User, Permission } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { userManagerUtils } from "@/components/admin/managerUtils";
import { syncStorage } from "@/utils/syncStorage";

export const useUserManager = () => {
  const { toast } = useToast();
  const { currentUser, isOfflineMode } = useAuth();
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
        // Verifica a conexão primeiro
        await syncStorage.checkConnection();
        
        // Carrega os usuários
        const fetchedUsers = await userManagerUtils.getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: error instanceof Error ? error.message : "Não foi possível carregar a lista de usuários. Verifique sua conexão com a internet.",
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

  const handleAddUser = async (user: User) => {
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      // Adiciona o usuário
      const updatedUsers = [...users, user];
      await userManagerUtils.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Usuário adicionado",
        description: "O usuário foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível adicionar o usuário. Verifique sua conexão com a internet.",
      });
    }
  };

  const openChangePasswordDialog = (user: User) => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não é possível alterar senhas sem conexão com o banco de dados.",
      });
      return;
    }
    
    setSelectedUser(user);
    setIsChangePasswordDialogOpen(true);
  };

  const openEditPermissionsDialog = (user: User) => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não é possível editar permissões sem conexão com o banco de dados.",
      });
      return;
    }
    
    setSelectedUser(user);
    setIsEditPermissionsDialogOpen(true);
  };

  const openDeleteUserDialog = (user: User) => {
    if (isOfflineMode) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não é possível excluir usuários sem conexão com o banco de dados.",
      });
      return;
    }
    
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  const handleChangePassword = async (userId: number, newPassword: string) => {
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, password: newPassword } : user
      );
      
      await userManagerUtils.saveUsers(updatedUsers);
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
        description: error instanceof Error ? error.message : "Não foi possível alterar a senha. Verifique sua conexão com a internet.",
      });
    }
  };

  const handleEditPermissions = async (userId: number, permissions: Permission[]) => {
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, permissions } : user
      );
      
      await userManagerUtils.saveUsers(updatedUsers);
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
        description: error instanceof Error ? error.message : "Não foi possível atualizar as permissões. Verifique sua conexão com a internet.",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      // Verifica a conexão
      await syncStorage.checkConnection();
      
      if (userId === currentUser?.id) {
        toast({
          variant: "destructive",
          title: "Operação não permitida",
          description: "Você não pode excluir seu próprio usuário",
        });
        return;
      }
      
      const updatedUsers = users.filter((user) => user.id !== userId);
      await userManagerUtils.saveUsers(updatedUsers);
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
        description: error instanceof Error ? error.message : "Não foi possível excluir o usuário. Verifique sua conexão com a internet.",
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
