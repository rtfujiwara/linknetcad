import { TableCell, TableRow } from "@/components/ui/table";
import { ClientActions } from "./ClientActions.jsx";

export const ClientRow = ({
  client,
  onEdit,
  onPrint,
  onDelete,
  canDelete,
}) => {
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
