
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClientData } from "@/types/client";
import { Plan } from "@/types/plan";
import FormField from "./FormField";
import { ValidationError } from "@/hooks/useFieldValidation";

interface ServiceFieldsProps {
  formData: ClientData;
  plans: Plan[];
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
  errors: Record<string, ValidationError>;
  validateField: (field: string, value: string, type: 'document' | 'cep' | 'phone' | 'email' | 'required') => void;
}

const ServiceFields = ({ formData, plans, setFormData, errors, validateField }: ServiceFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="plan" className="flex items-center">
            Plano <span className="text-red-500 ml-1">*</span>
          </Label>
          <select
            id="plan"
            required
            className={`w-full px-3 py-2 border ${errors.plan?.hasError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 h-10`}
            value={formData.plan}
            onChange={(e) => {
              setFormData({ ...formData, plan: e.target.value });
              validateField('plan', e.target.value, 'required');
            }}
            onBlur={() => validateField('plan', formData.plan, 'required')}
          >
            <option value="">Selecione um plano</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.name}>
                {plan.name} - R$ {plan.price.toFixed(2)}
              </option>
            ))}
          </select>
          {errors.plan?.hasError && (
            <p className="text-red-500 text-xs mt-1">{errors.plan.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate" className="flex items-center">
            Dia de Vencimento <span className="text-red-500 ml-1">*</span>
          </Label>
          <select
            id="dueDate"
            required
            className={`w-full px-3 py-2 border ${errors.dueDate?.hasError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 h-10`}
            value={formData.dueDate}
            onChange={(e) => {
              setFormData({ ...formData, dueDate: e.target.value });
              validateField('dueDate', e.target.value, 'required');
            }}
            onBlur={() => validateField('dueDate', formData.dueDate, 'required')}
          >
            <option value="">Selecione</option>
            <option value="05">05</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          {errors.dueDate?.hasError && (
            <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="wifiName"
          label="Nome do Wi-Fi"
          value={formData.wifiName}
          error={errors.wifiName}
          onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
        />

        <FormField
          id="wifiPassword"
          label="Senha do Wi-Fi"
          value={formData.wifiPassword}
          error={errors.wifiPassword}
          onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
        />
      </div>
    </>
  );
};

export default ServiceFields;

