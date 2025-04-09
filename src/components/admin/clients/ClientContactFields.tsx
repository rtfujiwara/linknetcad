
import { Client } from "@/types/client";
import { ClientFormField } from "./ClientFormField";

interface ClientContactFieldsProps {
  client: Client;
  onChange: (updatedClient: Client) => void;
}

export const ClientContactFields = ({ client, onChange }: ClientContactFieldsProps) => {
  return (
    <>
      <ClientFormField
        id="edit-email"
        label="E-mail"
        value={client.email}
        onChange={(value) => onChange({ ...client, email: value })}
      />

      <ClientFormField
        id="edit-phone"
        label="Telefone"
        value={client.phone}
        onChange={(value) => onChange({ ...client, phone: value })}
      />

      <ClientFormField
        id="edit-alternativePhone"
        label="Telefone Recado"
        value={client.alternativePhone}
        onChange={(value) => onChange({ ...client, alternativePhone: value })}
      />
    </>
  );
};
