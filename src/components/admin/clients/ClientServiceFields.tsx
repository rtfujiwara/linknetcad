
import { Client } from "@/types/client";
import { ClientFormField } from "./ClientFormField";

interface ClientServiceFieldsProps {
  client: Client;
  onChange: (updatedClient: Client) => void;
  handleDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClientServiceFields = ({ 
  client, 
  onChange,
  handleDueDateChange 
}: ClientServiceFieldsProps) => {
  return (
    <>
      <ClientFormField
        id="edit-plan"
        label="Plano"
        value={client.plan}
        onChange={(value) => onChange({ ...client, plan: value })}
      />

      <ClientFormField
        id="edit-dueDate"
        label="Dia de Vencimento"
        maxLength={2}
        placeholder="Ex: 05"
        value={client.dueDate}
        onChange={(value) => onChange({ ...client, dueDate: value })}
        handleCustomChange={handleDueDateChange}
      />

      <ClientFormField
        id="edit-wifiName"
        label="Nome do Wi-Fi"
        value={client.wifiName}
        onChange={(value) => onChange({ ...client, wifiName: value })}
      />

      <ClientFormField
        id="edit-wifiPassword"
        label="Senha do Wi-Fi"
        value={client.wifiPassword}
        onChange={(value) => onChange({ ...client, wifiPassword: value })}
      />
    </>
  );
};
