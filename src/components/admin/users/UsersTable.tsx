
import { Button } from "@/components/ui/button";
import { KeyRound, PenSquare, Trash2 } from "lucide-react";
import { User } from "@/types/user";
import { PERMISSIONS } from "./userConstants";

interface UsersTableProps {
  users: User[];
  currentUserId?: number;
  canManageUsers: boolean;
  onChangePassword: (user: User) => void;
  onEditPermissions: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export const UsersTable = ({
  users,
  currentUserId,
  canManageUsers,
  onChangePassword,
  onEditPermissions,
  onDeleteUser,
}: UsersTableProps) => {
  const filteredUsers = users.filter(
    (user) => currentUserId === undefined || !user.isAdmin || user.id === currentUserId
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Usuário</th>
            <th className="px-4 py-2 text-left">Permissões</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">
                <div className="flex flex-wrap gap-1">
                  {user.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 text-xs bg-gray-100 rounded"
                    >
                      {PERMISSIONS.find((p) => p.value === permission)?.label}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-2">
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
                      >
                        <PenSquare className="mr-1 h-4 w-4" />
                        Permissões
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteUser(user)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Excluir
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
