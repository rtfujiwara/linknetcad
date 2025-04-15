
/**
 * Firebase initialization module
 */
import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database, ref, get } from "firebase/database";
import { firebaseConfig } from "./config";

// Firebase initialization state
let app: FirebaseApp | null = null;
let database: Database | null = null;
let firebaseInitialized = false;
let initializationAttempted = false;

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
    return database;
  } catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
    firebaseInitialized = false;
    database = null;
    return null;
  }
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
};

/**
 * Check Firebase connection status
 */
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    if (!database) {
      database = initializeFirebase();
      if (!database) return false;
    }
    
    // Try a simple operation to verify connection with a shorter timeout
    const testRef = ref(database, ".info/connected");
    const snapshot = await Promise.race([
      get(testRef),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout ao verificar conexão")), 3000);
      })
    ]);
    
    return true; // If we reach here without timing out, connection is ok
  } catch (error) {
    console.warn("Erro ao verificar conexão com Firebase:", error);
    return false;
  }
};

// Try to initialize Firebase on module load but don't throw errors
try {
  initializeFirebase();
} catch (error) {
  console.error("Erro na inicialização inicial do Firebase:", error);
}
