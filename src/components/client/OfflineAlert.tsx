
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

interface OfflineAlertProps {
  onRetryConnection: () => Promise<void>;
  isSubmitting: boolean;
}

const OfflineAlert = ({ onRetryConnection, isSubmitting }: OfflineAlertProps) => {
  return (
    <Alert variant="warning" className="bg-yellow-50 border-yellow-300">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Modo offline ativo</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <p className="mb-2">Você está sem conexão com o servidor. O cadastro será salvo localmente e sincronizado quando a conexão for restaurada.</p>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="bg-white text-yellow-700 border-yellow-400 hover:bg-yellow-50"
          onClick={onRetryConnection}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Tentar reconectar
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default OfflineAlert;
