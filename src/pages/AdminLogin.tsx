
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { syncStorage } from "@/utils/syncStorage";
import { LoadingScreen } from "@/components/admin/login/LoadingScreen";
import { BackgroundEffects } from "@/components/admin/login/BackgroundEffects";
import { LoginContainer } from "@/components/admin/login/LoginContainer";
import { resetConnectionCheck } from "@/utils/storage/connectionManager";

const AdminLogin = () => {
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkUsers = async () => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        // Reseta o status de verificação de conexão e tenta conectar automaticamente
        resetConnectionCheck();
        
        // Verifica o status da conexão sem mostrar mensagens ao usuário
        const isOnline = await syncStorage.checkConnection();
        setIsOfflineMode(!isOnline);
        
        // Inicializa dados padrão se necessário
        await syncStorage.initializeDefaultData();
        
        // Adiciona um timeout para não ficar travado infinitamente
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Timeout ao verificar usuários")), 8000);
        });
        
        const usersPromise = syncStorage.getItem("users", []);
        
        // Utiliza Promise.race para garantir que não ficará carregando para sempre
        const users = await Promise.race([usersPromise, timeoutPromise]);
        setShowCreateAdmin(!users || users.length === 0);
        
      } catch (error) {
        console.error("Erro ao verificar usuários:", error);
        // Se houver timeout ou erro, assume que não há usuários e permite criar admin
        setShowCreateAdmin(true);
        setIsError(true);
        setIsOfflineMode(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Executa a checagem inicial e configura verificações periódicas automáticas
    checkUsers();
    
    // Configure um intervalo para tentar reconectar periodicamente sem avisar o usuário
    const autoReconnectInterval = setInterval(async () => {
      try {
        resetConnectionCheck();
        const isOnline = await syncStorage.checkConnection();
        setIsOfflineMode(!isOnline);
        
        if (isOnline) {
          // Se conseguiu conectar, recarrega a lista de usuários
          const users = await syncStorage.getItem("users", []);
          setShowCreateAdmin(!users || users.length === 0);
        }
      } catch (error) {
        console.error("Falha na reconexão automática:", error);
      }
    }, 10000); // Tenta a cada 10 segundos
    
    return () => {
      clearInterval(autoReconnectInterval);
    };
  }, [toast]);

  // Função para tentar reconectar (agora silenciosa, sem notificações)
  const retryConnection = async () => {
    try {
      // Reset connection check status
      resetConnectionCheck();
      
      const isOnline = await syncStorage.checkConnection();
      setIsOfflineMode(!isOnline);
      
      if (isOnline) {
        // Recarrega a lista de usuários silenciosamente
        const users = await syncStorage.getItem("users", []);
        setShowCreateAdmin(!users || users.length === 0);
      }
      
      return isOnline;
    } catch (error) {
      console.error("Falha na tentativa de reconexão:", error);
      return false;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden p-4"
    >
      <BackgroundEffects />

      <div className="relative h-screen flex flex-col items-center justify-center">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src="/lovable-uploads/d03abdb3-b61b-43e7-b5d4-4983ff5fcf27.png"
          alt="Linknet Vale Logo"
          className="w-48 md:w-64 mb-8"
        />

        <div className="w-full max-w-md">
          <LoginContainer 
            showCreateAdmin={showCreateAdmin}
            isOfflineMode={isOfflineMode}
            onRetryConnection={retryConnection}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
