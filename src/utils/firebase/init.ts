
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
let initializationStartTime = 0;

/**
 * Initialize Firebase if not already initialized
 */
export const initializeFirebase = () => {
  // Se já existe uma inicialização em andamento, retorna a promise
  if (initializationPromise) {
    return initializationPromise;
  }

  // Se já inicializou com sucesso, retorna o banco de dados existente
  if (firebaseInitialized && database) return database;
  
  // Registra o tempo de início para medir o desempenho
  initializationStartTime = performance.now();
  
  // Se já tentou inicializar há pouco tempo, não tenta novamente
  if (initializationAttempted && (performance.now() - initializationStartTime < 5000)) {
    return database;
  }
  
  initializationAttempted = true;
  
  try {
    // Cria uma nova promise que será resolvida quando o Firebase for inicializado
    initializationPromise = new Promise<Database | null>(async (resolve) => {
      try {
        console.log("Iniciando inicialização do Firebase...");
        app = initializeApp(firebaseConfig);
        database = getDatabase(app);
        firebaseInitialized = true;
        
        const duration = performance.now() - initializationStartTime;
        console.log(`Firebase inicializado com sucesso em ${duration.toFixed(2)}ms`);
        
        // Listen for connection status changes
        if (database) {
          const connRef = ref(database, '.info/connected');
          onValue(connRef, (snap) => {
            const newStatus = snap.val() === true;
            
            // Atualiza o status de conexão
            connectionStatus = newStatus;
          });
        }
        
        // Limpa a promise após completar com sucesso
        setTimeout(() => {
          initializationPromise = null;
        }, 1000);
        
        resolve(database);
      } catch (error) {
        console.error("Erro ao inicializar Firebase:", error);
        firebaseInitialized = false;
        database = null;
        connectionStatus = false;
        
        // Limpa a promise após falhar
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
    
    initializationPromise = null;
    return null;
  }
};

/**
 * Get the current database instance
 */
export const getFirebaseDatabase = async () => {
  if (!database) {
    return await initializeFirebase();
  }
  return database;
};

/**
 * Reset initialization status
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
        setTimeout(() => reject(new Error("Timeout ao verificar conexão")), 2000);
      })
    ]);
    
    connectionStatus = snapshot.exists() && snapshot.val() === true;
    return connectionStatus;
  } catch (error) {
    console.warn("Erro ao verificar conexão com Firebase:", error);
    connectionStatus = false;
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
(async () => {
  try {
    await initializeFirebase();
  } catch (error) {
    console.error("Erro na inicialização inicial do Firebase:", error);
  }
})();
