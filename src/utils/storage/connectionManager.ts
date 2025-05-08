
/**
 * Connection management module
 */
import { checkFirebaseConnection, getConnectionStatus, resetFirebaseInitialization } from "../firebase/init";

// Flag para controlar tentativas repetidas
let connectionCheckInProgress = false;
let lastConnectionAttempt = 0;
let reconnectionTimer: ReturnType<typeof setTimeout> | null = null;
const CONNECTION_RETRY_INTERVAL = 5000; // Reduzido para 5 segundos (era 10s)
const MAX_RETRY_ATTEMPTS = 5;
let currentRetryAttempts = 0;

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
  currentRetryAttempts++;
  
  try {
    // Force reset initialization if needed to ensure proper connection check
    if (now - lastConnectionAttempt > 30000 || currentRetryAttempts > MAX_RETRY_ATTEMPTS) { // 30 segundos ou muitas tentativas
      resetFirebaseInitialization();
      currentRetryAttempts = 0;
    }

    // Use a timeout to prevent hanging (reduzido para 2.5 segundos)
    const isConnected = await Promise.race([
      checkFirebaseConnection(),
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.warn("Timeout na verificação de conexão");
          resolve(false);
        }, 2500);
      })
    ]);
    
    if (!isConnected) {
      console.warn("Sem conexão com o banco de dados. Agendando verificação automática silenciosa.");
      scheduleReconnection();
    } else {
      console.log("Conexão com o banco de dados estabelecida com sucesso!");
      // Reseta o contador de tentativas
      currentRetryAttempts = 0;
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
  
  // Programa um nova verificação automática com intervalo progressivo
  const delay = Math.min(CONNECTION_RETRY_INTERVAL * Math.pow(1.5, currentRetryAttempts), 30000);
  
  reconnectionTimer = setTimeout(() => {
    console.log(`Tentando verificação automática de conexão (tentativa ${currentRetryAttempts})...`);
    resetConnectionCheck();
    checkConnection();
  }, delay);
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
