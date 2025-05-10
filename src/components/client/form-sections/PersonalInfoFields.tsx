
import React from "react";
import { ClientData } from "@/types/client";
import FormField from "./FormField";
import { ValidationError } from "@/hooks/useFieldValidation";

interface PersonalInfoFieldsProps {
  formData: ClientData;
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
  errors: Record<string, ValidationError>;
  validateField: (field: string, value: string, type: 'document' | 'cep' | 'phone' | 'email' | 'required') => void;
}

const PersonalInfoFields = ({ formData, setFormData, errors, validateField }: PersonalInfoFieldsProps) => {
  return (
    <>
      <FormField
        id="name"
        label="Nome"
        required
        value={formData.name}
        error={errors.name}
        validateOnBlur="required"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        onValidate={validateField}
      />

      <FormField
        id="email"
        label="E-mail"
        type="email"
        required
        value={formData.email}
        error={errors.email}
        validateOnBlur="email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        onValidate={validateField}
      />

      <FormField
        id="document"
        label="CPF / CNPJ"
        required
        value={formData.document}
        error={errors.document}
        formatOnBlur="document"
        validateOnBlur="document"
        onChange={(e) => setFormData({ ...formData, document: e.target.value })}
        onValidate={validateField}
      />

      <FormField
        id="rgIe"
        label="RG / IE"
        required
        value={formData.rgIe}
        error={errors.rgIe}
        validateOnBlur="required"
        onChange={(e) => setFormData({ ...formData, rgIe: e.target.value })}
        onValidate={validateField}
      />

      <FormField
        id="birthDate"
        label="Data de Nascimento"
        type="date"
        required
        value={formData.birthDate}
        error={errors.birthDate}
        validateOnBlur="required"
        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
        onValidate={validateField}
      />
    </>
  );
};

export default PersonalInfoFields;

