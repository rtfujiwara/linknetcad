
/**
 * Connection management module
 */
import { isFirebaseConnected, getConnectionStatus, resetFirebaseInitialization } from "../firebase/init";

// Flag para controlar tentativas repetidas
let connectionCheckInProgress = false;
let lastConnectionAttempt = 0;
let reconnectionTimer: ReturnType<typeof setTimeout> | null = null;
const CONNECTION_RETRY_INTERVAL = 5000; // Reduzido para 5 segundos (era 10s)

/**
 * Check connection and return boolean status
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
    console.log("Verificação de conexão já em andamento ou muito recente");
    return cachedStatus || false;
  }
  
  connectionCheckInProgress = true;
  lastConnectionAttempt = now;
  
  try {
    // Force reset initialization if needed to ensure proper connection check
    if (now - lastConnectionAttempt > 30000) { // 30 segundos (era 60s)
      resetFirebaseInitialization();
    }

    // Use a timeout to prevent hanging (3 segundos de timeout - reduzido de 8s)
    const isConnected = await Promise.race([
      isFirebaseConnected(),
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.warn("Timeout na verificação de conexão");
          resolve(false);
        }, 3000);
      })
    ]);
    
    if (!isConnected) {
      console.warn("Sem conexão com o banco de dados. Agendando verificação automática.");
      scheduleReconnection();
    } else {
      console.log("Conexão com o banco de dados estabelecida com sucesso!");
    }
    
    connectionCheckInProgress = false;
    return isConnected;
  } catch (error) {
    console.error("Erro ao verificar conexão:", error);
    connectionCheckInProgress = false;
    scheduleReconnection();
    return false;
  }
};

/**
 * Schedule automatic reconnection
 */
const scheduleReconnection = () => {
  // Limpa qualquer timer existente
  if (reconnectionTimer) {
    clearTimeout(reconnectionTimer);
  }
  
  // Programa um nova verificação automática
  reconnectionTimer = setTimeout(() => {
    console.log("Tentando verificação automática de conexão...");
    resetConnectionCheck();
    checkConnection();
  }, CONNECTION_RETRY_INTERVAL);
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
