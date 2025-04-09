
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ClientPersonalFields } from "./clients/ClientPersonalFields";
import { ClientContactFields } from "./clients/ClientContactFields";
import { ClientAddressFields } from "./clients/ClientAddressFields";
import { ClientServiceFields } from "./clients/ClientServiceFields";

interface EditClientModalProps {
  client: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
  onChange: (updatedClient: Client) => void;
}

export const EditClientModal = ({
  client,
  onSave,
  onCancel,
  onChange,
}: EditClientModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Scrollar para o topo quando o modal abrir
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [client]);
  
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    if (Number(value) > 31) return;
    onChange({ ...client, dueDate: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white pt-2 pb-2 z-10">Editar Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClientPersonalFields client={client} onChange={onChange} />
          <ClientContactFields client={client} onChange={onChange} />
          <ClientAddressFields client={client} onChange={onChange} />
          <ClientServiceFields 
            client={client} 
            onChange={onChange} 
            handleDueDateChange={handleDueDateChange} 
          />
        </div>

        <div className="flex justify-end space-x-2 mt-6 sticky bottom-0 bg-white pb-2 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(client)}>
            Salvar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
