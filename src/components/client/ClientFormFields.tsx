
import React from "react";
import { ClientData } from "@/types/client";
import { Plan } from "@/types/plan";
import FormSections from "./form-sections/FormSections";

interface ClientFormFieldsProps {
  formData: ClientData;
  plans: Plan[];
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
}

const ClientFormFields = ({ formData, plans, setFormData }: ClientFormFieldsProps) => {
  return (
    <FormSections
      formData={formData}
      plans={plans}
      setFormData={setFormData}
    />
  );
};

export default ClientFormFields;
