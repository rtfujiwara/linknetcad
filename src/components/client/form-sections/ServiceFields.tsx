
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClientData } from "@/types/client";
import { Plan } from "@/types/plan";

interface ServiceFieldsProps {
  formData: ClientData;
  plans: Plan[];
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
}

const ServiceFields = ({ formData, plans, setFormData }: ServiceFieldsProps) => {
  return (
    <>
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

export default ServiceFields;
