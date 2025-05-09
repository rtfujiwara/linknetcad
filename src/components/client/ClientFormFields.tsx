
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClientData } from "@/types/client";

interface ClientFormFieldsProps {
  formData: ClientData;
  plans: { id: number; name: string; price: number; description: string; }[];
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
}

const ClientFormFields = ({ formData, plans, setFormData }: ClientFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="document">CPF / CNPJ *</Label>
        <Input
          id="document"
          required
          value={formData.document}
          onChange={(e) => setFormData({ ...formData, document: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rgIe">RG / IE *</Label>
        <Input
          id="rgIe"
          required
          value={formData.rgIe}
          onChange={(e) => setFormData({ ...formData, rgIe: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Data de Nascimento *</Label>
        <Input
          id="birthDate"
          type="date"
          required
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Endereço *</Label>
          <Input
            id="address"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Número *</Label>
          <Input
            id="number"
            required
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="complement">Complemento</Label>
        <Input
          id="complement"
          value={formData.complement}
          onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro *</Label>
          <Input
            id="neighborhood"
            required
            value={formData.neighborhood}
            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">Estado *</Label>
          <Input
            id="state"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP *</Label>
          <Input
            id="zipCode"
            required
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="condoName">Nome do Condomínio</Label>
        <Input
          id="condoName"
          value={formData.condoName}
          onChange={(e) => setFormData({ ...formData, condoName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alternativePhone">Telefone Recado</Label>
          <Input
            id="alternativePhone"
            value={formData.alternativePhone}
            onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="plan">Plano *</Label>
          <select
            id="plan"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
          >
            <option value="">Selecione um plano</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.name}>
                {plan.name} - R$ {plan.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Dia de Vencimento *</Label>
          <select
            id="dueDate"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="05">05</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wifiName">Nome do Wi-Fi</Label>
          <Input
            id="wifiName"
            value={formData.wifiName}
            onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wifiPassword">Senha do Wi-Fi</Label>
          <Input
            id="wifiPassword"
            value={formData.wifiPassword}
            onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
          />
        </div>
      </div>
    </>
  );
};

export default ClientFormFields;
