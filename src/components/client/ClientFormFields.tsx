
import React from "react";
import { ClientData } from "@/types/client";
import { Plan } from "@/types/plan";
import FormSections from "./form-sections/FormSections";
import { useFieldValidation } from "@/hooks/useFieldValidation";

interface ClientFormFieldsProps {
  formData: ClientData;
  plans: Plan[];
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
}

const ClientFormFields = ({ formData, plans, setFormData }: ClientFormFieldsProps) => {
  const { errors, validateField, validateAll, clearErrors } = useFieldValidation();

  return (
    <FormSections
      formData={formData}
      plans={plans}
      setFormData={setFormData}
      errors={errors}
      validateField={validateField}
    />
  );
};

export default ClientFormFields;
