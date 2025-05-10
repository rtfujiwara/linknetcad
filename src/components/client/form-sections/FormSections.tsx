
import React from "react";
import { ClientData } from "@/types/client";
import { Plan } from "@/types/plan";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import PersonalInfoFields from "./PersonalInfoFields";
import AddressFields from "./AddressFields";
import ContactFields from "./ContactFields";
import ServiceFields from "./ServiceFields";

interface FormSectionsProps {
  formData: ClientData;
  plans: Plan[];
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
}

const FormSections = ({ formData, plans, setFormData }: FormSectionsProps) => {
  const [openSections, setOpenSections] = React.useState({
    personal: true,
    address: true,
    contact: true,
    service: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-6">
      <Collapsible
        open={openSections.personal}
        onOpenChange={() => toggleSection("personal")}
        className="border rounded-md p-2"
      >
        <CollapsibleTrigger className="flex justify-between w-full items-center p-2 font-medium">
          Dados Pessoais
          {openSections.personal ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2 space-y-4 pt-4">
          <PersonalInfoFields formData={formData} setFormData={setFormData} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={openSections.address}
        onOpenChange={() => toggleSection("address")}
        className="border rounded-md p-2"
      >
        <CollapsibleTrigger className="flex justify-between w-full items-center p-2 font-medium">
          Endereço
          {openSections.address ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2 space-y-4 pt-4">
          <AddressFields formData={formData} setFormData={setFormData} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={openSections.contact}
        onOpenChange={() => toggleSection("contact")}
        className="border rounded-md p-2"
      >
        <CollapsibleTrigger className="flex justify-between w-full items-center p-2 font-medium">
          Contato
          {openSections.contact ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2 space-y-4 pt-4">
          <ContactFields formData={formData} setFormData={setFormData} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={openSections.service}
        onOpenChange={() => toggleSection("service")}
        className="border rounded-md p-2"
      >
        <CollapsibleTrigger className="flex justify-between w-full items-center p-2 font-medium">
          Serviço
          {openSections.service ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2 space-y-4 pt-4">
          <ServiceFields formData={formData} plans={plans} setFormData={setFormData} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FormSections;
