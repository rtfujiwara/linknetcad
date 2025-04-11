
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
  const { currentUser, isAdmin, hasPermission, isOfflineMode, retryConnection } = useAuth();
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
      {isOfflineMode && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <p>Erro de conexão com o banco de dados. O sistema precisa estar online para funcionar corretamente.</p>
          <button 
            onClick={retryConnection}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Tentar reconectar
          </button>
        </div>
      )}
      
      {clients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum cliente cadastrado</p>
          {isOfflineMode && (
            <p className="text-sm text-red-500">
              Não é possível carregar ou cadastrar clientes sem conexão com o banco de dados.
            </p>
          )}
        </div>
      ) : (
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
                      disabled={isOfflineMode}
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
                        disabled={isOfflineMode}
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
      )}
    </div>
  );
};
