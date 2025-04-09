
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { PERMISSIONS, NewUserFormData } from "./userConstants";

interface AddUserDialogProps {
  onAddUser: (user: User) => void;
}

export const AddUserDialog = ({ onAddUser }: AddUserDialogProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUserFormData>({
    username: "",
    password: "",
    name: "",
    permissions: [],
  });

  const togglePermission = (permission: typeof PERMISSIONS[0]["value"]) => {
    setNewUser((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.some((u: User) => u.username === newUser.username);
    if (userExists) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome de usuário já existe",
      });
      return;
    }

    const user: User = {
      id: Date.now(),
      ...newUser,
      isAdmin: false,
    };

    onAddUser(user);

    setNewUser({
      username: "",
      password: "",
      name: "",
      permissions: [],
    });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Usuário</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, username: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Permissões</Label>
            <div className="grid grid-cols-1 gap-2">
              {PERMISSIONS.map((permission) => (
                <div
                  key={permission.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={permission.value}
                    checked={newUser.permissions.includes(permission.value)}
                    onCheckedChange={() => togglePermission(permission.value)}
                  />
                  <label htmlFor={permission.value}>{permission.label}</label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleAddUser} className="w-full">
            Criar Usuário
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
