import { Table, TableBody } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { ClientTableHeader } from "./client/ClientTableHeader";
import { ClientRow } from "./client/ClientRow.jsx";

export const ClientsTable = ({ 
  clients, 
  onEdit, 
  onPrint, 
  onDelete 
}) => {
  const { isAdmin, hasPermission } = useAuth();
  const canDelete = isAdmin || hasPermission("delete_data");
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
      <Table>
        <ClientTableHeader />
        <TableBody>
          {clients.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              onEdit={onEdit}
              onPrint={onPrint}
              onDelete={onDelete}
              canDelete={canDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
