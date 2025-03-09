
import { TableCell, TableRow } from "@/components/ui/table";
import { Client } from "@/types/client";
import { ClientActions } from "./ClientActions";

interface ClientRowProps {
  client: Client;
  onEdit: (client: Client) => void;
  onPrint: (client: Client) => void;
  onDelete?: (client: Client) => void;
  canDelete: boolean;
}

export const ClientRow = ({
  client,
  onEdit,
  onPrint,
  onDelete,
  canDelete,
}: ClientRowProps) => {
  return (
    <TableRow>
      <TableCell>{client.name}</TableCell>
      <TableCell>{client.email}</TableCell>
      <TableCell>{client.document}</TableCell>
      <TableCell>{client.phone}</TableCell>
      <TableCell>{client.plan}</TableCell>
      <TableCell>{client.dueDate}</TableCell>
      <TableCell>
        <ClientActions
          client={client}
          onEdit={onEdit}
          onPrint={onPrint}
          onDelete={onDelete}
          canDelete={canDelete}
        />
      </TableCell>
    </TableRow>
  );
};
