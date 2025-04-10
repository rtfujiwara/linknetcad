
import { Client } from "@/types/client";
import { ClientsTable } from "@/components/admin/ClientsTable";
import { EditClientModal } from "@/components/admin/EditClientModal";

interface ClientsTabContentProps {
  clients: Client[];
  editingClient: Client | null;
  updatedClient: Client | null;
  handleEdit: (client: Client) => void;
  handlePrint: (client: Client) => void;
  handleDelete: (client: Client) => void;
  handleSaveEdit: (client: Client) => void;
  setUpdatedClient: (client: Client | null) => void;
}

export function ClientsTabContent({
  clients,
  editingClient,
  updatedClient,
  handleEdit,
  handlePrint,
  handleDelete,
  handleSaveEdit,
  setUpdatedClient
}: ClientsTabContentProps) {
  return (
    <div className="space-y-4">
      <ClientsTable
        clients={clients}
        onEdit={handleEdit}
        onPrint={handlePrint}
        onDelete={handleDelete}
      />
      
      {editingClient && updatedClient && (
        <EditClientModal
          client={updatedClient}
          onSave={handleSaveEdit}
          onCancel={() => setUpdatedClient(null)}
          onChange={(updatedClient) => setUpdatedClient(updatedClient)}
        />
      )}
    </div>
  );
}
