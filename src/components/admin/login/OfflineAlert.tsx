
import React from "react";
import { RefreshCw } from "lucide-react";

interface OfflineAlertProps {
  onRetryConnection: () => void;
  isRetrying?: boolean;
}

export const OfflineAlert = ({ onRetryConnection, isRetrying = false }: OfflineAlertProps) => {
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
      <p>Funcionando em modo offline. Dados serão sincronizados quando a conexão for restabelecida.</p>
      <button 
        onClick={onRetryConnection}
        disabled={isRetrying}
        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors flex items-center gap-1"
      >
        <RefreshCw className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`} />
        Reconectar
      </button>
    </div>
  );
};
