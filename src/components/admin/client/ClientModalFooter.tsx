
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";

interface ClientModalFooterProps {
  onSave: (client: Client) => void;
  onCancel: () => void;
  client: Client;
}

export const ClientModalFooter = ({
  onSave,
  onCancel,
  client,
}: ClientModalFooterProps) => {
  return (
    <div className="flex justify-end space-x-2 mt-6 sticky bottom-0 bg-white pb-2 pt-2">
      <Button variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button onClick={() => onSave(client)}>
        Salvar
      </Button>
    </div>
  );
};
