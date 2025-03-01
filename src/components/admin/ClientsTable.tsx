
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/types/client";
import { ViewClientData } from "./ViewClientData";
import { useAuth } from "@/contexts/AuthContext";

interface ClientsTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onPrint: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

export const ClientsTable = ({ clients, onEdit, onPrint, onDelete }: ClientsTableProps) => {
  const { isAdmin, hasPermission } = useAuth();
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>CPF/CNPJ</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.document}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.plan}</TableCell>
              <TableCell>{client.dueDate}</TableCell>
              <TableCell>
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
                  {(isAdmin || hasPermission("delete_data")) && onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(client)}
                    >
                      Excluir
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
