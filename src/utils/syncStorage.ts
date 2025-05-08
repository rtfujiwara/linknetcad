
/**
 * Synchronization storage utility for Firebase Realtime Database
 */
import { initializeFirebase } from "./firebase/init";
import { StorageInterface } from "./storage/types";
import { setItem, getItem, getItemSync, removeItem, clear, addChangeListener, checkConnection, initializeDefaultData } from "./storage/syncManager";

export const syncStorage: StorageInterface = {
  setItem,
  getItem,
  getItemSync,
  removeItem,
  clear,
  addChangeListener,
  checkConnection,
  initializeDefaultData
};

// Initialize the system on module load and attempt connection immediately
(async () => {
  try {
    // Try to initialize Firebase immediately
    const db = await initializeFirebase();
    console.log("Firebase inicializado na carga do módulo:", !!db);
    
    // Initialize default data in background
    initializeDefaultData().catch(err => {
      console.warn("Erro ao inicializar dados padrão:", err);
    });
  } catch (error) {
    console.error("Erro na inicialização do syncStorage:", error);
  }
})();
