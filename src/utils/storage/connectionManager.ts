
/**
 * Connection management module
 */
import { isFirebaseConnected } from "./firebaseStorage";

// Flag para controlar tentativas repetidas
let connectionCheckInProgress = false;

/**
 * Check connection and return boolean status
 */
export const checkConnection = async (): Promise<boolean> => {
  if (connectionCheckInProgress) {
    return false; // Retorna imediatamente para evitar múltiplas verificações simultâneas
  }
  
  connectionCheckInProgress = true;
  
  try {
    // Use a timeout to prevent hanging
    const isConnected = await Promise.race([
      isFirebaseConnected(),
      new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(false), 3000);
      })
    ]);
    
    if (!isConnected) {
      console.warn("Sem conexão com o banco de dados. Verificação retornou false.");
    }
    
    connectionCheckInProgress = false;
    return isConnected;
  } catch (error) {
    console.error("Erro ao verificar conexão:", error);
    connectionCheckInProgress = false;
    return false;
  }
};
