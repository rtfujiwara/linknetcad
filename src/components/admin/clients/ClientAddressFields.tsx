
import { Client } from "@/types/client";
import { ClientFormField } from "./ClientFormField";

interface ClientAddressFieldsProps {
  client: Client;
  onChange: (updatedClient: Client) => void;
}

export const ClientAddressFields = ({ client, onChange }: ClientAddressFieldsProps) => {
  return (
    <>
      <ClientFormField
        id="edit-address"
        label="Endereço"
        value={client.address}
        onChange={(value) => onChange({ ...client, address: value })}
      />

      <ClientFormField
        id="edit-number"
        label="Número"
        value={client.number}
        onChange={(value) => onChange({ ...client, number: value })}
      />

      <ClientFormField
        id="edit-complement"
        label="Complemento"
        value={client.complement}
        onChange={(value) => onChange({ ...client, complement: value })}
      />

      <ClientFormField
        id="edit-neighborhood"
        label="Bairro"
        value={client.neighborhood}
        onChange={(value) => onChange({ ...client, neighborhood: value })}
      />

      <ClientFormField
        id="edit-city"
        label="Cidade"
        value={client.city}
        onChange={(value) => onChange({ ...client, city: value })}
      />

      <ClientFormField
        id="edit-state"
        label="Estado"
        value={client.state}
        onChange={(value) => onChange({ ...client, state: value })}
      />

      <ClientFormField
        id="edit-zipCode"
        label="CEP"
        value={client.zipCode}
        onChange={(value) => onChange({ ...client, zipCode: value })}
      />

      <ClientFormField
        id="edit-condoName"
        label="Nome do Condomínio"
        value={client.condoName}
        onChange={(value) => onChange({ ...client, condoName: value })}
      />
    </>
  );
};
