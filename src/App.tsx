
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { syncStorage } from "./utils/syncStorage";
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { AlertCircle, X } from "lucide-react";

// Cria uma nova instância do QueryClient com configuração de retry
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Aumentado para 2 tentativas
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Backoff exponencial
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

// Inicia conexão Firebase imediatamente ao carregar o módulo com log de resultados
console.log("Iniciando verificação de conexão Firebase no carregamento do App...");
syncStorage.checkConnection()
  .then(connected => console.log("Status inicial de conexão Firebase:", connected ? "Conectado" : "Desconectado"))
  .catch(err => console.warn("Erro na verificação inicial de conexão:", err));

const App = () => {
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // Inicializa conexão e dados logo no carregamento da aplicação
  useEffect(() => {
    const initApp = async () => {
      try {
        console.log("Inicializando App...");
        
        // Tenta estabelecer conexão Firebase
        const isConnected = await syncStorage.checkConnection();
        console.log("Status de conexão Firebase:", isConnected ? "Conectado" : "Desconectado");
        
        // Mostra alerta após múltiplas tentativas sem sucesso
        if (!isConnected) {
          setConnectionAttempts(prev => prev + 1);
          
          if (connectionAttempts >= 2) {
            setShowConnectionError(true);
          }
          
          // Configura reconexão automática
          syncStorage.startAutoReconnect?.(() => {
            setShowConnectionError(false);
            setConnectionAttempts(0);
            // Recarrega dados após reconexão bem-sucedida
            syncStorage.initializeDefaultData().catch(err => {
              console.warn("Erro ao inicializar dados após reconexão:", err);
            });
          });
        } else {
          // Tenta inicializar dados padrão sem bloquear a interface
          syncStorage.initializeDefaultData().catch(err => {
            console.warn("Erro ao inicializar dados padrão:", err);
          });
        }
      } catch (error) {
        console.warn("Erro na inicialização:", error);
      }
    };
    
    initApp();
    
    // Registra listener para erros não tratados
    const handleError = (event: ErrorEvent) => {
      console.error("Erro não tratado capturado:", event.error);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      // Limpa recursos ao desmontar
      syncStorage.stopAutoReconnect?.();
    };
  }, [connectionAttempts]);
  
  // Função para tentar reconectar manualmente
  const handleRetryConnection = async () => {
    setShowConnectionError(false);
    
    try {
      // Reseta checagem de conexão
      syncStorage.resetConnectionCheck?.();
      
      const isConnected = await syncStorage.checkConnection();
      
      if (!isConnected) {
        // Mostra novamente se falhar
        setShowConnectionError(true);
      } else {
        // Inicializa dados se conectado com sucesso
        syncStorage.initializeDefaultData().catch(err => {
          console.warn("Erro ao inicializar dados após reconexão manual:", err);
        });
      }
    } catch (error) {
      console.error("Erro ao tentar reconectar manualmente:", error);
      setShowConnectionError(true);
    }
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AuthProvider>
          <TooltipProvider>
            {showConnectionError && (
              <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-sm">
                <Alert variant="destructive">
                  <div className="flex justify-between items-center">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <div>
                        <AlertTitle>Problemas de conexão</AlertTitle>
                        <AlertDescription>
                          <p className="mb-2">Não foi possível conectar ao servidor. Algumas funcionalidades podem estar limitadas.</p>
                          <div className="flex gap-2">
                            <button 
                              className="text-sm bg-white text-red-600 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                              onClick={handleRetryConnection}
                            >
                              Tentar novamente
                            </button>
                            <button 
                              className="text-sm bg-white text-gray-500 px-3 py-1 rounded border border-gray-200 hover:bg-gray-50"
                              onClick={() => setShowConnectionError(false)}
                            >
                              Continuar offline
                            </button>
                          </div>
                        </AlertDescription>
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setShowConnectionError(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </Alert>
              </div>
            )}
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Index />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
