
/**
 * Synchronization storage utility for Firebase Realtime Database
 */
import { initializeFirebase } from "./firebase/init";
import { StorageInterface } from "./storage/types";
import { 
  setItem, 
  getItem, 
  getItemSync, 
  removeItem, 
  clear, 
  addChangeListener, 
  checkConnection, 
  initializeDefaultData 
} from "./storage/syncManager";
import { resetConnectionCheck } from "./storage/connectionManager";

export const syncStorage: StorageInterface & {
  resetConnectionCheck?: () => void;
} = {
  setItem,
  getItem,
  getItemSync,
  removeItem,
  clear,
  addChangeListener,
  checkConnection,
  initializeDefaultData,
  resetConnectionCheck
};

// Initialize the system on module load and attempt connection immediately
(async () => {
  try {
    // Try to initialize Firebase immediately with retry
    const maxAttempts = 3;
    let db = null;
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        db = await initializeFirebase();
        if (db) break;
      } catch (err) {
        console.warn(`Tentativa ${i+1} falhou ao inicializar Firebase:`, err);
        // Pequena pausa entre tentativas
        if (i < maxAttempts - 1) {
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }
    
    console.log("Firebase inicializado na carga do módulo:", !!db);
    
    // Initialize default data in background with fast timeout
    try {
      const initPromise = initializeDefaultData();
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(false), 3000);
      });
      
      await Promise.race([initPromise, timeoutPromise]);
    } catch (err) {
      console.warn("Erro ao inicializar dados padrão:", err);
    }
  } catch (error) {
    console.error("Erro na inicialização do syncStorage:", error);
  }
})();
