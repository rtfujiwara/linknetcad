
/**
 * Connection management module
 */
import { checkFirebaseConnection, getConnectionStatus, resetFirebaseInitialization } from "../firebase/init";

// Flag para controlar tentativas repetidas
let connectionCheckInProgress = false;
let lastConnectionAttempt = 0;
let reconnectionTimer: ReturnType<typeof setTimeout> | null = null;
const CONNECTION_RETRY_INTERVAL = 3000; // Reduzido para 3 segundos para resposta mais rápida
const MAX_RETRY_ATTEMPTS = 3; // Reduzido para 3 tentativas
let currentRetryAttempts = 0;

/**
 * Check connection and return boolean status
 * Modificado para ser mais silencioso e eficiente
 */
export const checkConnection = async (): Promise<boolean> => {
  // Verifica se há um status de conexão armazenado em cache
  const cachedStatus = getConnectionStatus();
  if (cachedStatus !== null && cachedStatus === true) {
    return cachedStatus;
  }
  
  // Previne verificações muito próximas
  const now = Date.now();
  if (connectionCheckInProgress || (now - lastConnectionAttempt < CONNECTION_RETRY_INTERVAL)) {
    return cachedStatus || false;
  }
  
  connectionCheckInProgress = true;
  lastConnectionAttempt = now;
  currentRetryAttempts++;
  
  try {
    // Reseta a inicialização após várias tentativas
    if (currentRetryAttempts > MAX_RETRY_ATTEMPTS) {
      resetFirebaseInitialization();
      currentRetryAttempts = 0;
    }

    // Use a timeout to prevent hanging (reduzido para 1.5 segundos para maior responsividade)
    const isConnected = await Promise.race([
      checkFirebaseConnection(),
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, 1500);
      })
    ]);
    
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
