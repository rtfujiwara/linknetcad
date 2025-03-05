
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ClientFormFields } from "./client/ClientFormFields";
import { ClientModalHeader } from "./client/ClientModalHeader";
import { ClientModalFooter } from "./client/ClientModalFooter";

export const EditClientModal = ({
  client,
  onSave,
  onCancel,
  onChange,
}) => {
  const modalRef = useRef(null);
  
  // Scrollar para o topo quando o modal abrir
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [client]);
  
  const handleDueDateChange = (e) => {
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
        <ClientModalHeader title="Editar Cliente" />
        
        <ClientFormFields 
          client={client}
          onChange={onChange}
          handleDueDateChange={handleDueDateChange}
        />

        <ClientModalFooter 
          onSave={onSave}
          onCancel={onCancel}
          client={client}
        />
      </div>
    </motion.div>
  );
};
