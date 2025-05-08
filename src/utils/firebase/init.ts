
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
let initializationPromise: Promise<Database | null> | null = null;

/**
 * Initialize Firebase if not already initialized
 */
export const initializeFirebase = () => {
  // Se já existe uma inicialização em andamento, retorna a promise
  if (initializationPromise) {
    return initializationPromise;
  }

  // Se já tentou inicializar, não tenta novamente para evitar loops
  if (initializationAttempted) {
    return database;
  }
  
  initializationAttempted = true;
  
  if (firebaseInitialized && database) return database;
  
  try {
    // Cria uma nova promise que será resolvida quando o Firebase for inicializado
    initializationPromise = new Promise<Database | null>(async (resolve) => {
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
        
        // Limpa a promise após completar
        setTimeout(() => {
          initializationPromise = null;
        }, 1000);
        
        resolve(database);
      } catch (error) {
        console.error("Erro ao inicializar Firebase:", error);
        firebaseInitialized = false;
        database = null;
        connectionStatus = false;
        
        // Agenda reconexão automática em caso de falha
        scheduleReconnection();
        
        // Limpa a promise após completar
        setTimeout(() => {
          initializationPromise = null;
        }, 1000);
        
        resolve(null);
      }
    });
    
    return initializationPromise;
  } catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
    firebaseInitialized = false;
    database = null;
    connectionStatus = false;
    
    // Agenda reconexão automática em caso de falha
    scheduleReconnection();
    
    initializationPromise = null;
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
  }, 3000); // Tenta a cada 3 segundos (reduzido de 5s)
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
      database = await initializeFirebase();
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
        setTimeout(() => reject(new Error("Timeout ao verificar conexão")), 2000); // Reduzido de 3s para 2s
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
 * Check if Firebase is connected - this is essentially an alias
 * for checkFirebaseConnection for backwards compatibility
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
