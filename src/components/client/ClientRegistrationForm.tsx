
import React, { useState } from "react";
import ClientFormFields from "./ClientFormFields";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useClientSubmit } from "@/hooks/useClientSubmit";
import { ClientData } from "@/types/client";
import OfflineAlert from "./OfflineAlert";
import SubmitButton from "./SubmitButton";

interface ClientRegistrationFormProps {
  plans: { id: number; name: string; price: number; description: string; }[];
}

const ClientRegistrationForm = ({ plans }: ClientRegistrationFormProps) => {
  const [formData, setFormData] = useState<ClientData>({
    name: "",
    email: "",
    document: "",
    rgIe: "",
    birthDate: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    condoName: "",
    phone: "",
    alternativePhone: "",
    plan: "",
    dueDate: "",
    wifiName: "",
    wifiPassword: "",
  });

  const { isOffline, handleRetryConnection } = useConnectionStatus();
  const { isSubmitting, showSaveSuccess, handleSubmit } = useClientSubmit();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData, isOffline);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isOffline && !showSaveSuccess && (
        <OfflineAlert 
          onRetryConnection={handleRetryConnection}
          isSubmitting={isSubmitting} 
        />
      )}
      
      <ClientFormFields 
        formData={formData}
        plans={plans}
        setFormData={setFormData}
      />

      <div className="pt-6">
        <SubmitButton 
          isSubmitting={isSubmitting} 
          isOffline={isOffline} 
        />
      </div>
    </form>
  );
};

export default ClientRegistrationForm;
