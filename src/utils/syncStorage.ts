
/**
 * Synchronization storage utility for Firebase Realtime Database
 */
import { initializeFirebase } from "./firebase/init";
import { StorageInterface } from "./storage/types";
import { setItem, getItem, getItemSync, removeItem, clear, addChangeListener, checkConnection, initializeData } from "./storage/syncManager";

export const syncStorage: StorageInterface = {
  setItem,
  getItem,
  getItemSync,
  removeItem,
  clear,
  addChangeListener,
  checkConnection,
  initializeDefaultData: initializeData
};

// Initialize the system on module load
(async () => {
  try {
    // Try to initialize Firebase
    initializeFirebase();
    // We'll initialize default data when needed, not on module load
  } catch (error) {
    console.error("Erro na inicialização do syncStorage:", error);
  }
})();
