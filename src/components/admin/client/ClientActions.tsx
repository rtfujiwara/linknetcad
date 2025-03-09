
import { Button } from "@/components/ui/button";
import { ViewClientData } from "@/components/admin/ViewClientData";
import { Client } from "@/types/client";

interface ClientActionsProps {
  client: Client;
  onEdit: (client: Client) => void;
  onPrint: (client: Client) => void;
  onDelete?: (client: Client) => void;
  canDelete: boolean;
}

export const ClientActions = ({
  client,
  onEdit,
  onPrint,
  onDelete,
  canDelete,
}: ClientActionsProps) => {
  return (
    <div className="space-x-2">
      <ViewClientData client={client} />
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(client)}
      >
        Editar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPrint(client)}
      >
        Imprimir
      </Button>
      {canDelete && onDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(client)}
        >
          Excluir
        </Button>
      )}
    </div>
  );
};
