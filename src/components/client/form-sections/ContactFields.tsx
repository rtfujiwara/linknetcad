
import React from "react";
import { ClientData } from "@/types/client";
import FormField from "./FormField";
import { ValidationError } from "@/hooks/useFieldValidation";

interface ContactFieldsProps {
  formData: ClientData;
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
  errors: Record<string, ValidationError>;
  validateField: (field: string, value: string, type: 'document' | 'cep' | 'phone' | 'email' | 'required') => void;
}

const ContactFields = ({ formData, setFormData, errors, validateField }: ContactFieldsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        id="phone"
        label="Telefone"
        required
        value={formData.phone}
        error={errors.phone}
        formatOnBlur="phone"
        validateOnBlur="phone"
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        onValidate={validateField}
      />

      <FormField
        id="alternativePhone"
        label="Telefone Recado"
        value={formData.alternativePhone}
        error={errors.alternativePhone}
        formatOnBlur="phone"
        validateOnBlur="phone"
        onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
        onValidate={validateField}
      />
    </div>
  );
};

export default ContactFields;
