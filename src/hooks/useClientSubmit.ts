
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { ClientData } from "@/types/client";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { validateDocument, validateCEP, validatePhone, validateEmail } from "@/utils/validations";

export const useClientSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validateAll, clearErrors } = useFieldValidation();

  const validateAllFields = (formData: ClientData): boolean => {
    // Define os campos que devem ser validados
    const fieldsToValidate = [
      { field: 'name', value: formData.name, type: 'required' as const },
      { field: 'email', value: formData.email, type: 'email' as const },
      { field: 'document', value: formData.document, type: 'document' as const },
      { field: 'rgIe', value: formData.rgIe, type: 'required' as const },
      { field: 'birthDate', value: formData.birthDate, type: 'required' as const },
      { field: 'address', value: formData.address, type: 'required' as const },
      { field: 'number', value: formData.number, type: 'required' as const },
      { field: 'neighborhood', value: formData.neighborhood, type: 'required' as const },
      { field: 'city', value: formData.city, type: 'required' as const },
      { field: 'state', value: formData.state, type: 'required' as const },
      { field: 'zipCode', value: formData.zipCode, type: 'cep' as const },
      { field: 'phone', value: formData.phone, type: 'phone' as const },
      { field: 'alternativePhone', value: formData.alternativePhone, type: formData.alternativePhone ? 'phone' as const : 'required' as const },
      { field: 'plan', value: formData.plan, type: 'required' as const },
      { field: 'dueDate', value: formData.dueDate, type: 'required' as const }
    ];
    
    return validateAll(fieldsToValidate);
  };

  const handleSubmit = async (formData: ClientData, isOffline: boolean) => {
    // Validação de todos os campos usando o hook
    if (!validateAllFields(formData)) {
      toast({
        variant: "destructive",
        title: "Dados inválidos",
        description: "Por favor, corrija os campos destacados e tente novamente.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check connection status before proceeding
      let isConnected = false;
      try {
        isConnected = await syncStorage.checkConnection();
      } catch (error) {
        console.error("Erro ao verificar conexão:", error);
      }
      
      // Try to get existing clients
      let clients = [];
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          clients = await syncStorage.getItem<(ClientData & { id: number })[]>("clients", []);
          break; // If successful, exit the loop
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) {
            console.error("Erro após várias tentativas de carregar clientes:", error);
            // Use local cache as fallback
            clients = syncStorage.getItemSync<(ClientData & { id: number })[]>("clients", []);
            break;
          }
          
          // Wait a bit before trying again (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
        }
      }
      
      // Add the new client
      const newClient = { ...formData, id: Date.now() };
      const updatedClients = [...clients, newClient];
      
      // Try to save
      retryCount = 0;
      let savedSuccessfully = false;
      
      while (retryCount < maxRetries && !savedSuccessfully) {
        try {
          await syncStorage.setItem("clients", updatedClients);
          savedSuccessfully = true;
          break;
        } catch (error) {
          retryCount++;
          
          if (retryCount >= maxRetries) {
            console.error("Erro após várias tentativas de salvar cliente:", error);
            
            // Save locally as a last resort
            localStorage.setItem("clients", JSON.stringify({
              timestamp: Date.now(),
              data: updatedClients
            }));
            
            // Mark for future synchronization
            localStorage.setItem("sync_pending_clients", JSON.stringify({
              timestamp: Date.now(),
              operation: 'set',
              data: updatedClients
            }));
            
            break;
          }
          
          // Wait a bit before trying again (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
        }
      }
      
      // Set success state
      setShowSaveSuccess(true);
      
      // Show appropriate toast based on the result
      if (savedSuccessfully) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Seus dados foram salvos.",
        });
      } else {
        toast({
          variant: isOffline ? "default" : "destructive",
          title: isOffline ? "Cadastrado em modo offline" : "Aviso de sincronização",
          description: isOffline 
            ? "Seus dados foram salvos localmente e serão sincronizados quando a conexão for restabelecida."
            : "Houve um problema ao sincronizar os dados, mas eles foram salvos localmente.",
        });
      }
      
      // Redirect after some time
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      
      // Try to save locally as a final fallback
      try {
        const localClients = syncStorage.getItemSync<(ClientData & { id: number })[]>("clients", []);
        const newClient = { ...formData, id: Date.now() };
        localClients.push(newClient);
        
        // Save directly to localStorage
        localStorage.setItem("clients", JSON.stringify({
          timestamp: Date.now(),
          data: localClients
        }));
        
        toast({
          variant: "default",
          title: "Cadastrado em modo offline",
          description: "Seus dados foram salvos localmente e serão sincronizados quando a conexão for restabelecida.",
        });
        
        // Set success state for redirection
        setShowSaveSuccess(true);
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
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

  return {
    isSubmitting,
    showSaveSuccess,
    handleSubmit
  };
};

