
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EmptyPlansState = () => {
  return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">Nenhum plano disponível</p>
      <p className="text-gray-600 mb-6">É necessário que um administrador adicione planos primeiro.</p>
      <Link to="/">
        <Button variant="outline">Voltar para a página inicial</Button>
      </Link>
    </div>
  );
};

export default EmptyPlansState;
