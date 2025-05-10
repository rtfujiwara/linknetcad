
/**
 * Connection management module
 */
import { checkFirebaseConnection, getConnectionStatus, resetFirebaseInitialization } from "../firebase/init";

// Flag para controlar tentativas repetidas
let connectionCheckInProgress = false;
let lastConnectionAttempt = 0;
let reconnectionTimer: ReturnType<typeof setTimeout> | null = null;
const CONNECTION_RETRY_INTERVAL = 3000; // Aumentado para 3 segundos
const MAX_RETRY_ATTEMPTS = 3;
let currentRetryAttempts = 0;
let cachedConnectionStatus: boolean | null = null;
let lastSuccessfulConnectionTime = 0;

// Tempo de cache da conexão (30 segundos)
const CONNECTION_CACHE_TTL = 30000; // Aumentado para 30 segundos

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

    // Use a timeout to prevent hanging
    const isConnected = await Promise.race([
      checkFirebaseConnection(),
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, 5000); // Timeout aumentado para 5 segundos
      })
    ]);
    
    // Atualiza o status em cache
    cachedConnectionStatus = isConnected;
    
    if (isConnected) {
      lastSuccessfulConnectionTime = now;
      currentRetryAttempts = 0; // Reset counter on success
      console.log("Conexão Firebase estabelecida com sucesso");
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
  currentRetryAttempts = 0; // Reseta contador de tentativas
  
  console.log("Estado de verificação de conexão redefinido");
  
  // Também reseta o estado do Firebase
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

/**
 * Iniciar tentativas de reconexão automática
 */
export const startAutoReconnect = (callback?: () => void) => {
  stopAutoReconnect(); // Para evitar múltiplos timers

  reconnectionTimer = setInterval(async () => {
    try {
      const isConnected = await checkConnection();
      if (isConnected && callback) {
        callback();
      }
    } catch (e) {
      console.warn("Erro na reconexão automática:", e);
    }
  }, 15000); // Tenta a cada 15 segundos
};

/**
 * Parar tentativas de reconexão automática
 */
export const stopAutoReconnect = () => {
  if (reconnectionTimer) {
    clearInterval(reconnectionTimer);
    reconnectionTimer = null;
  }
};
