
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ClientFormFields from "./ClientFormFields";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { syncStorage } from "@/utils/syncStorage";
import { ClientData } from "@/types/client";
import { Loader2 } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name || !formData.document || !formData.phone || !formData.plan) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Tenta inicializar conexão primeiro, com retry automatico
      await syncStorage.checkConnection();
      
      // Tenta obter os clientes existentes com retry
      let clients = [];
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          clients = await syncStorage.getItem<(ClientData & { id: number })[]>("clients", []);
          break; // Se bem sucedido, sai do loop
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) throw error;
          
          // Espera um pouco antes de tentar novamente (backoff exponencial)
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
        }
      }
      
      // Adiciona o novo cliente
      const newClient = { ...formData, id: Date.now() };
      const updatedClients = [...clients, newClient];
      
      // Tenta salvar com retry
      retryCount = 0;
      while (retryCount < maxRetries) {
        try {
          await syncStorage.setItem("clients", updatedClients);
          break; // Se bem sucedido, sai do loop
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) throw error;
          
          // Tenta estabelecer conexão novamente
          await syncStorage.checkConnection();
          
          // Espera um pouco antes de tentar novamente (backoff exponencial)
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
        }
      }
      
      // Se chegou aqui, salvou com sucesso
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Seus dados foram salvos.",
      });
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      
      // Tenta salvar localmente como fallback
      try {
        const localClients = syncStorage.getItemSync<(ClientData & { id: number })[]>("clients", []);
        const newClient = { ...formData, id: Date.now() };
        localClients.push(newClient);
        localStorage.setItem("clients", JSON.stringify(localClients));
        
        toast({
          variant: "default",
          title: "Cadastrado em modo offline",
          description: "Seus dados foram salvos localmente e serão sincronizados quando a conexão for restabelecida.",
        });
        
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (localError) {
        toast({
          variant: "destructive",
          title: "Erro ao cadastrar",
          description: "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
        });
      }
    } finally {
      setIsSubmitting(false);
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
        <Button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
};

export default ClientRegistrationForm;
