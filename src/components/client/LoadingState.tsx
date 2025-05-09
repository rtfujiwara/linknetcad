
import React from "react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-blue-500" role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Carregando...
        </span>
      </div>
      <p className="text-gray-600 mt-4">Carregando planos disponíveis...</p>
    </div>
  );
};

export default LoadingState;
