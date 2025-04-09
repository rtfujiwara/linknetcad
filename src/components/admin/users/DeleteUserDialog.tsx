
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User } from "@/types/user";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onDeleteUser: (userId: number) => void;
}

export const DeleteUserDialog = ({
  isOpen,
  onOpenChange,
  selectedUser,
  onDeleteUser,
}: DeleteUserDialogProps) => {
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    onDeleteUser(selectedUser.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Tem certeza que deseja excluir o usuário {selectedUser?.name}?</p>
          <p className="text-destructive">Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Excluir
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
