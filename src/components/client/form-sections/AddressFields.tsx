
import React from "react";
import { ClientData } from "@/types/client";
import FormField from "./FormField";
import { ValidationError } from "@/hooks/useFieldValidation";

interface AddressFieldsProps {
  formData: ClientData;
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
  errors: Record<string, ValidationError>;
  validateField: (field: string, value: string, type: 'document' | 'cep' | 'phone' | 'email' | 'required') => void;
}

const AddressFields = ({ formData, setFormData, errors, validateField }: AddressFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="address"
          label="Endereço"
          required
          value={formData.address}
          error={errors.address}
          validateOnBlur="required"
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          onValidate={validateField}
        />

        <FormField
          id="number"
          label="Número"
          required
          value={formData.number}
          error={errors.number}
          validateOnBlur="required"
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          onValidate={validateField}
        />
      </div>

      <FormField
        id="complement"
        label="Complemento"
        value={formData.complement}
        error={errors.complement}
        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="neighborhood"
          label="Bairro"
          required
          value={formData.neighborhood}
          error={errors.neighborhood}
          validateOnBlur="required"
          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
          onValidate={validateField}
        />

        <FormField
          id="city"
          label="Cidade"
          required
          value={formData.city}
          error={errors.city}
          validateOnBlur="required"
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          onValidate={validateField}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="state"
          label="Estado"
          required
          value={formData.state}
          error={errors.state}
          validateOnBlur="required"
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          onValidate={validateField}
        />

        <FormField
          id="zipCode"
          label="CEP"
          required
          value={formData.zipCode}
          error={errors.zipCode}
          formatOnBlur="cep"
          validateOnBlur="cep"
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          onValidate={validateField}
        />
      </div>

      <FormField
        id="condoName"
        label="Nome do Condomínio"
        value={formData.condoName}
        error={errors.condoName}
        onChange={(e) => setFormData({ ...formData, condoName: e.target.value })}
      />
    </>
  );
};

export default AddressFields;

