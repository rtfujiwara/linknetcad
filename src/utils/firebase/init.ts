
/**
 * Firebase initialization module
 */
import { initializeApp } from "firebase/app";
import { getDatabase, Database, ref, get } from "firebase/database";
import { firebaseConfig } from "./config";

// Firebase initialization state
let app;
let database: Database | null = null;
let firebaseInitialized = false;

/**
 * Initialize Firebase if not already initialized
 */
export const initializeFirebase = () => {
  if (firebaseInitialized) return database;
  
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
    throw new Error("Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.");
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
 * Check Firebase connection status
 */
export const checkFirebaseConnection = async (): Promise<boolean> => {
  if (!database) {
    try {
      database = initializeFirebase();
      if (!database) return false;
    } catch (error) {
      throw new Error("Não foi possível estabelecer conexão com o banco de dados.");
    }
  }
  
  try {
    // Try a simple operation to verify connection
    const testRef = ref(database, ".info/connected");
    const snapshot = await get(testRef);
    return snapshot.exists() && snapshot.val() === true;
  } catch (error) {
    console.error("Erro ao verificar conexão com Firebase:", error);
    throw new Error("Erro de conexão com o banco de dados. Verifique sua internet e tente novamente.");
  }
};

// Try to initialize Firebase on module load
try {
  initializeFirebase();
} catch (error) {
  console.error("Erro na inicialização inicial do Firebase:", error);
}
