
/**
 * Connection management module
 */
import { checkFirebaseConnection, getConnectionStatus, resetFirebaseInitialization } from "../firebase/init";

// Flag para controlar tentativas repetidas
let connectionCheckInProgress = false;
let lastConnectionAttempt = 0;
let reconnectionTimer: ReturnType<typeof setTimeout> | null = null;
const CONNECTION_RETRY_INTERVAL = 2000; // Reduzido para 2 segundos
const MAX_RETRY_ATTEMPTS = 3;
let currentRetryAttempts = 0;
let cachedConnectionStatus: boolean | null = null;
let lastSuccessfulConnectionTime = 0;

// Tempo de cache da conexão (15 segundos)
const CONNECTION_CACHE_TTL = 15000;

/**
 * Check connection and return boolean status
 */
export const checkConnection = async (): Promise<boolean> => {
  // Verifica se temos um status de conexão em cache recente
  const now = Date.now();
  if (cachedConnectionStatus === true && 
      (now - lastSuccessfulConnectionTime < CONNECTION_CACHE_TTL)) {
    return true;
  }
  
  // Verifica se há um status de conexão armazenado em cache
  const storedStatus = getConnectionStatus();
  
  // Previne verificações muito próximas
  if (connectionCheckInProgress || (now - lastConnectionAttempt < CONNECTION_RETRY_INTERVAL)) {
    return cachedConnectionStatus || storedStatus || false;
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

    // Use a timeout to prevent hanging (reduzido para 1.5 segundos)
    const isConnected = await Promise.race([
      checkFirebaseConnection(),
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, 1500);
      })
    ]);
    
    // Atualiza o status em cache
    cachedConnectionStatus = isConnected;
    
    if (isConnected) {
      lastSuccessfulConnectionTime = now;
      currentRetryAttempts = 0; // Reset counter on success
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
 */
export const resetConnectionCheck = () => {
  connectionCheckInProgress = false;
  lastConnectionAttempt = 0;
  cachedConnectionStatus = null; // Limpa o cache de status
  resetFirebaseInitialization();
};

/**
 * Check if we're allowed to operate offline for critical operations
 */
export const canOperateOffline = (operationType: 'read' | 'write' | 'admin'): boolean => {
  // Leituras sempre permitidas offline
  if (operationType === 'read') return true;
  
  // Escritas de alterações simples permitidas em modo offline
  if (operationType === 'write') {
    // Pode verificar o tamanho atual dos dados para evitar inconsistências graves
    return true;
  }
  
  // Operações administrativas importantes (como mudar senhas de outros usuários)
  // geralmente não são permitidas offline
  if (operationType === 'admin') {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    // Apenas admin master pode fazer operações admin offline
    return currentUser?.isAdmin === true && currentUser?.username === 'admin';
  }
  
  return false;
};
