
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">Erro ao carregar planos</p>
      <p className="text-gray-600 mb-6">Não foi possível conectar ao servidor para carregar os planos.</p>
      <div className="space-y-4">
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Tentar novamente
        </button>
        <Link to="/" className="block">
          <Button variant="outline">Voltar para a página inicial</Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;
