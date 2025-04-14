
import { Button } from "@/components/ui/button";
import { KeyRound, PenSquare, Trash2 } from "lucide-react";
import { User } from "@/types/user";
import { PERMISSIONS } from "./userConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface UsersTableProps {
  users: User[];
  currentUserId?: number;
  canManageUsers: boolean;
  onChangePassword: (user: User) => void;
  onEditPermissions: (user: User) => void;
  onDeleteUser: (user: User) => void;
  isLoading?: boolean;
}

export const UsersTable = ({
  users,
  currentUserId,
  canManageUsers,
  onChangePassword,
  onEditPermissions,
  onDeleteUser,
  isLoading = false,
}: UsersTableProps) => {
  const filteredUsers = users.filter(
    (user) => currentUserId === undefined || !user.isAdmin || user.id === currentUserId
  );

  // Quando não há usuários para mostrar
  const showEmptyState = !isLoading && filteredUsers.length === 0;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Permissões</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Estado de carregamento
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                <TableCell><Skeleton className="h-9 w-40" /></TableCell>
              </TableRow>
            ))
          ) : showEmptyState ? (
            // Estado vazio
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            // Lista de usuários
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.length === 0 ? (
                      <span className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-500">
                        Sem permissões
                      </span>
                    ) : (
                      user.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 text-xs bg-gray-100 rounded"
                        >
                          {PERMISSIONS.find((p) => p.value === permission)?.label || permission}
                        </span>
                      ))
                    )}
                    {user.isAdmin && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        Administrador
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onChangePassword(user)}
                    >
                      <KeyRound className="mr-1 h-4 w-4" />
                      Senha
                    </Button>

                    {canManageUsers && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditPermissions(user)}
                          disabled={user.isAdmin && currentUserId !== user.id}
                        >
                          <PenSquare className="mr-1 h-4 w-4" />
                          Permissões
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteUser(user)}
                          disabled={user.id === currentUserId || (user.isAdmin && users.filter(u => u.isAdmin).length <= 1)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Excluir
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
