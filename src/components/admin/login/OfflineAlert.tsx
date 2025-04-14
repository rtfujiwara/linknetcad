
import React from "react";

interface OfflineAlertProps {
  onRetryConnection: () => void;
}

export const OfflineAlert = ({ onRetryConnection }: OfflineAlertProps) => {
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
      <p>Funcionando em modo offline. Dados serão sincronizados quando a conexão for restabelecida.</p>
      <button 
        onClick={onRetryConnection}
        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
      >
        Reconectar
      </button>
    </div>
  );
};
