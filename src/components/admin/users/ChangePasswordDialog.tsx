
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
  DialogDescription,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { PasswordData } from "./userConstants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  currentUserId: number | undefined;
  onChangePassword: (
    userId: number,
    currentPassword: string, 
    newPassword: string
  ) => Promise<boolean>;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSelfPasswordChange = selectedUser?.id === currentUserId;
  
  // Verifica se o usuário logado é o admin master
  const isAdminMaster = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    return currentUser?.isAdmin === true && currentUser?.username === 'admin';
  };

  const handleChangePassword = async () => {
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

    setIsSubmitting(true);
    
    try {
      const success = await onChangePassword(
        selectedUser.id, 
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      
      if (success) {
        onOpenChange(false);
        
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reinicia os campos quando o dialog abre ou fecha
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Alterar Senha {selectedUser && `- ${selectedUser.name}`}
          </DialogTitle>
          {!isSelfPasswordChange && !isAdminMaster() && (
            <DialogDescription className="text-amber-600">
              Em modo offline, apenas o usuário admin pode alterar senhas de outros usuários.
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4">
          {/* Only show current password field if user is changing their own password */}
          {isSelfPasswordChange && (
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
          {passwordData.newPassword && 
           passwordData.newPassword.length > 0 && 
           passwordData.newPassword.length < 4 && (
            <Alert variant="destructive" className="py-2">
              <Info className="h-4 w-4" />
              <AlertDescription>
                A senha deve ter pelo menos 4 caracteres
              </AlertDescription>
            </Alert>
          )}
          <Button 
            onClick={handleChangePassword} 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Nova Senha"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
