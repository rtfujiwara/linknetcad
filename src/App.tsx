
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
import React, { useEffect } from "react";
import { syncStorage } from "./utils/syncStorage";

// Cria uma nova instância do QueryClient com configuração de retry
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

// Inicia conexão Firebase imediatamente ao carregar o módulo
syncStorage.checkConnection().catch(err => console.warn("Erro na verificação inicial de conexão:", err));

const App = () => {
  // Inicializa conexão e dados logo no carregamento da aplicação
  useEffect(() => {
    const initApp = async () => {
      try {
        // Tenta estabelecer conexão sem mostrar erros ao usuário
        await syncStorage.checkConnection();
        
        // Tenta inicializar dados padrão sem bloquear a interface
        syncStorage.initializeDefaultData().catch(err => {
          console.warn("Erro ao inicializar dados padrão:", err);
        });
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
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AuthProvider>
          <TooltipProvider>
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
