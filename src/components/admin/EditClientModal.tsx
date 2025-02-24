import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client } from "@/types/client";
import { motion } from "framer-motion";

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
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    if (Number(value) > 31) return;
    onChange({ ...client, dueDate: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
        <h2 className="text-xl font-semibold mb-4">Editar Cliente</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome</Label>
            <Input
              id="edit-name"
              value={client.name}
              onChange={(e) => onChange({ ...client, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-email">E-mail</Label>
            <Input
              id="edit-email"
              value={client.email}
              onChange={(e) => onChange({ ...client, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-document">CPF/CNPJ</Label>
            <Input
              id="edit-document"
              value={client.document}
              onChange={(e) => onChange({ ...client, document: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-rgIe">RG/IE</Label>
            <Input
              id="edit-rgIe"
              value={client.rgIe}
              onChange={(e) => onChange({ ...client, rgIe: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-birthDate">Data de Nascimento</Label>
            <Input
              id="edit-birthDate"
              type="date"
              value={client.birthDate}
              onChange={(e) => onChange({ ...client, birthDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-address">Endereço</Label>
            <Input
              id="edit-address"
              value={client.address}
              onChange={(e) => onChange({ ...client, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-number">Número</Label>
            <Input
              id="edit-number"
              value={client.number}
              onChange={(e) => onChange({ ...client, number: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-complement">Complemento</Label>
            <Input
              id="edit-complement"
              value={client.complement}
              onChange={(e) => onChange({ ...client, complement: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-neighborhood">Bairro</Label>
            <Input
              id="edit-neighborhood"
              value={client.neighborhood}
              onChange={(e) => onChange({ ...client, neighborhood: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-city">Cidade</Label>
            <Input
              id="edit-city"
              value={client.city}
              onChange={(e) => onChange({ ...client, city: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-state">Estado</Label>
            <Input
              id="edit-state"
              value={client.state}
              onChange={(e) => onChange({ ...client, state: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-zipCode">CEP</Label>
            <Input
              id="edit-zipCode"
              value={client.zipCode}
              onChange={(e) => onChange({ ...client, zipCode: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-condoName">Nome do Condomínio</Label>
            <Input
              id="edit-condoName"
              value={client.condoName}
              onChange={(e) => onChange({ ...client, condoName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Telefone</Label>
            <Input
              id="edit-phone"
              value={client.phone}
              onChange={(e) => onChange({ ...client, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-alternativePhone">Telefone Recado</Label>
            <Input
              id="edit-alternativePhone"
              value={client.alternativePhone}
              onChange={(e) => onChange({ ...client, alternativePhone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-plan">Plano</Label>
            <Input
              id="edit-plan"
              value={client.plan}
              onChange={(e) => onChange({ ...client, plan: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-dueDate">Dia de Vencimento</Label>
            <Input
              id="edit-dueDate"
              maxLength={2}
              placeholder="Ex: 05"
              value={client.dueDate}
              onChange={handleDueDateChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-wifiName">Nome do Wi-Fi</Label>
            <Input
              id="edit-wifiName"
              value={client.wifiName}
              onChange={(e) => onChange({ ...client, wifiName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-wifiPassword">Senha do Wi-Fi</Label>
            <Input
              id="edit-wifiPassword"
              value={client.wifiPassword}
              onChange={(e) => onChange({ ...client, wifiPassword: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
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
