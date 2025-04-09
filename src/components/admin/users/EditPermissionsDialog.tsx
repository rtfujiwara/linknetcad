
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, Permission } from "@/types/user";
import { PERMISSIONS } from "./userConstants";

interface EditPermissionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onSavePermissions: (userId: number, permissions: Permission[]) => void;
}

export const EditPermissionsDialog = ({
  isOpen,
  onOpenChange,
  selectedUser,
  onSavePermissions,
}: EditPermissionsDialogProps) => {
  const [editPermissions, setEditPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    if (selectedUser) {
      setEditPermissions([...selectedUser.permissions]);
    }
  }, [selectedUser]);

  const togglePermission = (permission: Permission) => {
    setEditPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSavePermissions = () => {
    if (!selectedUser) return;
    onSavePermissions(selectedUser.id, editPermissions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Editar Permissões {selectedUser && `- ${selectedUser.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Permissões</Label>
            <div className="grid grid-cols-1 gap-2">
              {PERMISSIONS.map((permission) => (
                <div
                  key={permission.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`edit-${permission.value}`}
                    checked={editPermissions.includes(permission.value)}
                    onCheckedChange={() => togglePermission(permission.value)}
                  />
                  <label htmlFor={`edit-${permission.value}`}>
                    {permission.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePermissions}>Salvar Permissões</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
