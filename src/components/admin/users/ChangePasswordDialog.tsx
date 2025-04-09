
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { PasswordData } from "./userConstants";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  currentUserId: number | undefined;
  onChangePassword: (
    userId: number,
    currentPassword: string, 
    newPassword: string
  ) => void;
}

export const ChangePasswordDialog = ({
  isOpen,
  onOpenChange,
  selectedUser,
  currentUserId,
  onChangePassword,
}: ChangePasswordDialogProps) => {
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = () => {
    if (!selectedUser) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem",
      });
      return;
    }

    if (passwordData.newPassword.length < 4) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve ter pelo menos 4 caracteres",
      });
      return;
    }

    onChangePassword(
      selectedUser.id, 
      passwordData.currentPassword, 
      passwordData.newPassword
    );

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Alterar Senha {selectedUser && `- ${selectedUser.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Only show current password field if user is changing their own password */}
          {selectedUser?.id === currentUserId && (
            <div>
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
              />
            </div>
          )}
          <div>
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
          </div>
          <Button onClick={handleChangePassword} className="w-full">
            Salvar Nova Senha
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
