
import { Client } from "@/types/client";
import { ClientFormField, ClientInput } from "./ClientFormField";

interface ClientFormFieldsProps {
  client: Client;
  onChange: (updatedClient: Client) => void;
  handleDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClientFormFields = ({
  client,
  onChange,
  handleDueDateChange,
}: ClientFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ClientFormField id="edit-name" label="Nome">
        <ClientInput
          id="edit-name"
          value={client.name}
          onChange={(e) => onChange({ ...client, name: e.target.value })}
        />
      </ClientFormField>
      
      <ClientFormField id="edit-email" label="E-mail">
        <ClientInput
          id="edit-email"
          value={client.email}
          onChange={(e) => onChange({ ...client, email: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-document" label="CPF/CNPJ">
        <ClientInput
          id="edit-document"
          value={client.document}
          onChange={(e) => onChange({ ...client, document: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-rgIe" label="RG/IE">
        <ClientInput
          id="edit-rgIe"
          value={client.rgIe}
          onChange={(e) => onChange({ ...client, rgIe: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-birthDate" label="Data de Nascimento">
        <ClientInput
          id="edit-birthDate"
          type="date"
          value={client.birthDate}
          onChange={(e) => onChange({ ...client, birthDate: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-address" label="Endereço">
        <ClientInput
          id="edit-address"
          value={client.address}
          onChange={(e) => onChange({ ...client, address: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-number" label="Número">
        <ClientInput
          id="edit-number"
          value={client.number}
          onChange={(e) => onChange({ ...client, number: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-complement" label="Complemento">
        <ClientInput
          id="edit-complement"
          value={client.complement}
          onChange={(e) => onChange({ ...client, complement: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-neighborhood" label="Bairro">
        <ClientInput
          id="edit-neighborhood"
          value={client.neighborhood}
          onChange={(e) => onChange({ ...client, neighborhood: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-city" label="Cidade">
        <ClientInput
          id="edit-city"
          value={client.city}
          onChange={(e) => onChange({ ...client, city: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-state" label="Estado">
        <ClientInput
          id="edit-state"
          value={client.state}
          onChange={(e) => onChange({ ...client, state: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-zipCode" label="CEP">
        <ClientInput
          id="edit-zipCode"
          value={client.zipCode}
          onChange={(e) => onChange({ ...client, zipCode: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-condoName" label="Nome do Condomínio">
        <ClientInput
          id="edit-condoName"
          value={client.condoName}
          onChange={(e) => onChange({ ...client, condoName: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-phone" label="Telefone">
        <ClientInput
          id="edit-phone"
          value={client.phone}
          onChange={(e) => onChange({ ...client, phone: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-alternativePhone" label="Telefone Recado">
        <ClientInput
          id="edit-alternativePhone"
          value={client.alternativePhone}
          onChange={(e) => onChange({ ...client, alternativePhone: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-plan" label="Plano">
        <ClientInput
          id="edit-plan"
          value={client.plan}
          onChange={(e) => onChange({ ...client, plan: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-dueDate" label="Dia de Vencimento">
        <ClientInput
          id="edit-dueDate"
          maxLength={2}
          placeholder="Ex: 05"
          value={client.dueDate}
          onChange={handleDueDateChange}
        />
      </ClientFormField>

      <ClientFormField id="edit-wifiName" label="Nome do Wi-Fi">
        <ClientInput
          id="edit-wifiName"
          value={client.wifiName}
          onChange={(e) => onChange({ ...client, wifiName: e.target.value })}
        />
      </ClientFormField>

      <ClientFormField id="edit-wifiPassword" label="Senha do Wi-Fi">
        <ClientInput
          id="edit-wifiPassword"
          value={client.wifiPassword}
          onChange={(e) => onChange({ ...client, wifiPassword: e.target.value })}
        />
      </ClientFormField>
    </div>
  );
};
