
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ClientFormFields from "./ClientFormFields";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { syncStorage } from "@/utils/syncStorage";
import { ClientData } from "@/types/client";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const [isOffline, setIsOffline] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verifica o status de conexão quando o componente é montado
  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const isConnected = await syncStorage.checkConnection();
        setIsOffline(!isConnected);
      } catch (error) {
        console.error("Erro ao verificar conexão:", error);
        setIsOffline(true);
      }
    };
    
    checkConnectionStatus();
    
    // Configura reconexão automática
    syncStorage.startAutoReconnect?.(() => {
      setIsOffline(false);
    });
    
    return () => {
      // Limpa quando o componente é desmontado
      syncStorage.stopAutoReconnect?.();
    };
  }, []);

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
      // Verifica o status de conexão antes de prosseguir
      let isConnected = false;
      try {
        isConnected = await syncStorage.checkConnection();
        setIsOffline(!isConnected);
      } catch (error) {
        console.error("Erro ao verificar conexão:", error);
        setIsOffline(true);
      }
      
      // Tenta obter os clientes existentes
      let clients = [];
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          clients = await syncStorage.getItem<(ClientData & { id: number })[]>("clients", []);
          break; // Se bem sucedido, sai do loop
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) {
            console.error("Erro após várias tentativas de carregar clientes:", error);
            // Usa cache local como fallback
            clients = syncStorage.getItemSync<(ClientData & { id: number })[]>("clients", []);
            break;
          }
          
          // Espera um pouco antes de tentar novamente (backoff exponencial)
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
        }
      }
      
      // Adiciona o novo cliente
      const newClient = { ...formData, id: Date.now() };
      const updatedClients = [...clients, newClient];
      
      // Tenta salvar
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
            
            // Salva localmente como último recurso
            localStorage.setItem("clients", JSON.stringify({
              timestamp: Date.now(),
              data: updatedClients
            }));
            
            // Marca para sincronização posterior
            localStorage.setItem("sync_pending_clients", JSON.stringify({
              timestamp: Date.now(),
              operation: 'set',
              data: updatedClients
            }));
            
            break;
          }
          
          // Espera um pouco antes de tentar novamente (backoff exponencial)
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
        }
      }
      
      // Define o estado de sucesso
      setShowSaveSuccess(true);
      
      // Mostra toast apropriado com base no resultado
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
      
      // Redireciona após algum tempo
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      
      // Tenta salvar localmente como fallback final
      try {
        const localClients = syncStorage.getItemSync<(ClientData & { id: number })[]>("clients", []);
        const newClient = { ...formData, id: Date.now() };
        localClients.push(newClient);
        
        // Salva no localStorage diretamente
        localStorage.setItem("clients", JSON.stringify({
          timestamp: Date.now(),
          data: localClients
        }));
        
        toast({
          variant: "default",
          title: "Cadastrado em modo offline",
          description: "Seus dados foram salvos localmente e serão sincronizados quando a conexão for restabelecida.",
        });
        
        // Define o estado de sucesso para redirecionamento
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

  // Função para tentar reconexão manualmente
  const handleRetryConnection = async () => {
    setIsOffline(true);
    syncStorage.resetConnectionCheck?.();
    
    try {
      const isConnected = await syncStorage.checkConnection();
      setIsOffline(!isConnected);
      
      if (isConnected) {
        toast({
          title: "Conexão restabelecida",
          description: "A conexão com o servidor foi restaurada com sucesso.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sem conexão",
          description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
        });
      }
    } catch (error) {
      console.error("Erro ao tentar reconectar:", error);
      toast({
        variant: "destructive",
        title: "Falha na reconexão",
        description: "Não foi possível verificar a conexão. Verifique sua internet.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isOffline && !showSaveSuccess && (
        <Alert variant="warning" className="bg-yellow-50 border-yellow-300">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Modo offline ativo</AlertTitle>
          <AlertDescription className="text-yellow-700">
            <p className="mb-2">Você está sem conexão com o servidor. O cadastro será salvo localmente e sincronizado quando a conexão for restaurada.</p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="bg-white text-yellow-700 border-yellow-400 hover:bg-yellow-50"
              onClick={handleRetryConnection}
            >
              <Loader2 className={`mr-2 h-4 w-4 ${isSubmitting ? "animate-spin" : ""}`} />
              Tentar reconectar
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
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
              {isOffline ? "Salvando localmente..." : "Cadastrando..."}
            </>
          ) : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
};

export default ClientRegistrationForm;
