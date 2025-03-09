
import { Table, TableBody } from "@/components/ui/table";
import { Client } from "@/types/client";
import { useAuth } from "@/contexts/AuthContext";
import { ClientTableHeader } from "./client/ClientTableHeader";
import { ClientRow } from "./client/ClientRow";

interface ClientsTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onPrint: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

export const ClientsTable = ({ 
  clients, 
  onEdit, 
  onPrint, 
  onDelete 
}: ClientsTableProps) => {
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
