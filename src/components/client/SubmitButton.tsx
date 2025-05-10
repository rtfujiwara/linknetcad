
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isOffline: boolean;
}

const SubmitButton = ({ isSubmitting, isOffline }: SubmitButtonProps) => {
  return (
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
  );
};

export default SubmitButton;
