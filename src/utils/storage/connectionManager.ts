
/**
 * Connection management module
 */
import { isFirebaseConnected, getConnectionStatus, resetFirebaseInitialization } from "../firebase/init";

// Flag para controlar tentativas repetidas
let connectionCheckInProgress = false;
let lastConnectionAttempt = 0;
const CONNECTION_RETRY_INTERVAL = 10000; // 10 segundos

/**
 * Check connection and return boolean status
 */
export const checkConnection = async (): Promise<boolean> => {
  // Verifica se há um status de conexão armazenado em cache
  const cachedStatus = getConnectionStatus();
  if (cachedStatus !== null) {
    return cachedStatus;
  }
  
  // Previne verificações muito próximas
  const now = Date.now();
  if (connectionCheckInProgress || (now - lastConnectionAttempt < CONNECTION_RETRY_INTERVAL)) {
    console.log("Verificação de conexão já em andamento ou muito recente");
    return false;
  }
  
  connectionCheckInProgress = true;
  lastConnectionAttempt = now;
  
  try {
    // Force reset initialization if needed to ensure proper connection check
    if (now - lastConnectionAttempt > 60000) { // 1 minuto
      resetFirebaseInitialization();
    }

    // Use a timeout to prevent hanging (8 segundos de timeout)
    const isConnected = await Promise.race([
      isFirebaseConnected(),
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.warn("Timeout na verificação de conexão");
          resolve(false);
        }, 8000);
      })
    ]);
    
    if (!isConnected) {
      console.warn("Sem conexão com o banco de dados. Verificação retornou false.");
    } else {
      console.log("Conexão com o banco de dados estabelecida com sucesso!");
    }
    
    connectionCheckInProgress = false;
    return isConnected;
  } catch (error) {
    console.error("Erro ao verificar conexão:", error);
    connectionCheckInProgress = false;
    return false;
  }
};

/**
 * Reset connection check status
 * Útil quando queremos forçar uma nova verificação de conexão
 */
export const resetConnectionCheck = () => {
  connectionCheckInProgress = false;
  lastConnectionAttempt = 0;
  resetFirebaseInitialization();
};
