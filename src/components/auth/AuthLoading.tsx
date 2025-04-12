
import React from "react";
import { Loader2 } from "lucide-react";

export const AuthLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center p-8 bg-white/30 backdrop-blur-sm rounded-lg shadow-lg">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="mt-2 text-lg font-medium text-blue-900">Carregando o sistema...</p>
        <p className="text-sm text-gray-500 mt-2">Por favor, aguarde enquanto preparamos tudo para você.</p>
      </div>
    </div>
  );
};
