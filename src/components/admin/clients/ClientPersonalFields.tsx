
import { Client } from "@/types/client";
import { ClientFormField } from "./ClientFormField";

interface ClientPersonalFieldsProps {
  client: Client;
  onChange: (updatedClient: Client) => void;
}

export const ClientPersonalFields = ({ client, onChange }: ClientPersonalFieldsProps) => {
  return (
    <>
      <ClientFormField
        id="edit-name"
        label="Nome"
        value={client.name}
        onChange={(value) => onChange({ ...client, name: value })}
      />

      <ClientFormField
        id="edit-document"
        label="CPF/CNPJ"
        value={client.document}
        onChange={(value) => onChange({ ...client, document: value })}
      />

      <ClientFormField
        id="edit-rgIe"
        label="RG/IE"
        value={client.rgIe}
        onChange={(value) => onChange({ ...client, rgIe: value })}
      />

      <ClientFormField
        id="edit-birthDate"
        label="Data de Nascimento"
        type="date"
        value={client.birthDate}
        onChange={(value) => onChange({ ...client, birthDate: value })}
      />
    </>
  );
};
