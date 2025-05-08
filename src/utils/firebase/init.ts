
/**
 * Firebase initialization module
 */
import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database, ref, get, onValue } from "firebase/database";
import { firebaseConfig } from "./config";

// Firebase initialization state
let app: FirebaseApp | null = null;
let database: Database | null = null;
let firebaseInitialized = false;
let initializationAttempted = false;
let connectionStatus: boolean | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Initialize Firebase if not already initialized
 */
export const initializeFirebase = () => {
  // Se já tentou inicializar, não tenta novamente para evitar loops
  if (initializationAttempted) {
    return database;
  }
  
  initializationAttempted = true;
  
  if (firebaseInitialized && database) return database;
  
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    firebaseInitialized = true;
    console.log("Firebase inicializado com sucesso");
    
    // Listen for connection status changes
    if (database) {
      const connRef = ref(database, '.info/connected');
      onValue(connRef, (snap) => {
        const newStatus = snap.val() === true;
        
        // Se o status mudou para conectado após uma desconexão
        if (!connectionStatus && newStatus) {
          console.log("Conexão com Firebase restabelecida automaticamente");
        } 
        // Se o status mudou para desconectado
        else if (connectionStatus && !newStatus) {
          console.log("Conexão com Firebase perdida, tentando reconectar automaticamente");
          // Agenda reconexão automática
          scheduleReconnection();
        }
        
        connectionStatus = newStatus;
        console.log(`Status da conexão Firebase: ${connectionStatus ? 'conectado' : 'desconectado'}`);
      });
    }
    
    return database;
  } catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
    firebaseInitialized = false;
    database = null;
    connectionStatus = false;
    
    // Agenda reconexão automática em caso de falha
    scheduleReconnection();
    
    return null;
  }
};

/**
 * Schedule automatic reconnection attempts
 */
const scheduleReconnection = () => {
  // Limpa qualquer timer existente
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }
  
  // Define um novo timer para tentar reconectar
  reconnectTimer = setTimeout(() => {
    console.log("Tentando reconexão automática com o Firebase...");
    resetFirebaseInitialization();
    initializeFirebase();
    reconnectTimer = null;
  }, 5000); // Tenta a cada 5 segundos
};

/**
 * Get the current database instance
 */
export const getFirebaseDatabase = () => {
  if (!database) {
    return initializeFirebase();
  }
  return database;
};

/**
 * Reset initialization status
 * Útil para testes ou para forçar a reconexão
 */
export const resetFirebaseInitialization = () => {
  initializationAttempted = false;
  connectionStatus = null;
};

/**
 * Get connection status
 */
export const getConnectionStatus = () => {
  return connectionStatus;
};

/**
 * Check Firebase connection status with faster timeout
 */
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    if (!database) {
      database = initializeFirebase();
      if (!database) return false;
    }
    
    // Return cached status if available to avoid unnecessary checks
    if (connectionStatus !== null) {
      return connectionStatus;
    }
    
    // Try a simple operation to verify connection with a shorter timeout
    const testRef = ref(database, ".info/connected");
    const snapshot = await Promise.race([
      get(testRef),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout ao verificar conexão")), 3000); // Reduzido de 8s para 3s
      })
    ]);
    
    connectionStatus = snapshot.exists() && snapshot.val() === true;
    return connectionStatus;
  } catch (error) {
    console.warn("Erro ao verificar conexão com Firebase:", error);
    connectionStatus = false;
    
    // Agenda uma reconexão automática
    scheduleReconnection();
    
    return false;
  }
};

/**
 * Check if Firebase is connected
 */
export const isFirebaseConnected = async (): Promise<boolean> => {
  return checkFirebaseConnection();
};

// Try to initialize Firebase on module load but don't throw errors
try {
  initializeFirebase();
} catch (error) {
  console.error("Erro na inicialização inicial do Firebase:", error);
}
