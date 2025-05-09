
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ClientFormFields from "./ClientFormFields";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { syncStorage } from "@/utils/syncStorage";
import { ClientData } from "@/types/client";

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

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const clients = await syncStorage.getItem<(ClientData & { id: number })[]>("clients", []);
      const updatedClients = [...clients, { ...formData, id: Date.now() }];
      await syncStorage.setItem("clients", updatedClients);
      
      setFormData({
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
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Seus dados foram salvos.",
      });
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ClientFormFields 
        formData={formData}
        plans={plans}
        setFormData={setFormData}
      />
      <div className="pt-6">
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
          Cadastrar
        </Button>
      </div>
    </form>
  );
};

export default ClientRegistrationForm;
