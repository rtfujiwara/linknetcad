
/**
 * Storage synchronization manager
 */
import { saveToLocalStorage, getDataFromLocalStorage, removeFromLocalStorage, clearLocalStorage } from "./localStorageHelpers";
import { saveToFirebase, getFromFirebase, removeFromFirebase, addFirebaseListeners, isFirebaseConnected } from "./firebaseStorage";
import { StorageEvent } from "./types";
import { initializeDefaultData } from "./defaultData";

/**
 * Notify about storage changes
 */
const notifyChange = (key: string, value: any): void => {
  window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value } }));
};

/**
 * Store data with timestamp
 */
export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    // Always save to localStorage first for reliability
    saveToLocalStorage(key, value);
    
    // Try to sync with Firebase if possible
    try {
      await saveToFirebase(key, value);
    } catch (error) {
      console.warn("Erro ao sincronizar com Firebase, dados salvos apenas localmente");
    }
    
    // Notify about the change (useful for syncing components)
    notifyChange(key, value);
  } catch (error) {
    console.error("Erro ao armazenar dados:", error);
    throw new Error("Não foi possível salvar os dados. Verifique sua conexão com a internet.");
  }
};

/**
 * Get data from storage
 */
export const getItem = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    // Always try from localStorage first for performance and offline support
    const localData = getDataFromLocalStorage(key, defaultValue);
    
    try {
      // Try to get from Firebase
      const { data, exists } = await getFromFirebase<T>(key);
      
      if (exists) {
        // Update the localStorage as cache
        saveToLocalStorage(key, data);
        return data;
      } else if (localData !== defaultValue) {
        // If we have data locally but not in Firebase, sync to Firebase
        await setItem(key, localData);
        return localData;
      }
      return defaultValue;
    } catch (error) {
      console.warn("Erro ao obter dados do Firebase:", error);
      // In case of error, fall back to local data
      return localData;
    }
  } catch (error) {
    console.error("Erro ao recuperar dados armazenados:", error);
    return defaultValue;
  }
};

/**
 * Synchronous version for compatibility (always tries first from localStorage)
 */
export const getItemSync = <T>(key: string, defaultValue: T): T => {
  return getDataFromLocalStorage(key, defaultValue);
};

/**
 * Remove item from storage
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    // Remove from localStorage
    removeFromLocalStorage(key);
    
    // Try to remove from Firebase
    await removeFromFirebase(key);
    
    // Notify about the removal
    notifyChange(key, null);
  } catch (error) {
    console.error("Erro ao remover dados:", error);
    throw new Error("Não foi possível remover os dados. Verifique sua conexão com a internet.");
  }
};

/**
 * Clear all items
 */
export const clear = async (): Promise<void> => {
  try {
    clearLocalStorage();
    
    // Notify about the clearing
    notifyChange(null, null);
  } catch (error) {
    console.error("Erro ao limpar dados:", error);
  }
};

/**
 * Add a listener for storage changes
 */
export const addChangeListener = (callback: (key: string, value: any) => void): (() => void) => {
  const handler = (event: CustomEvent) => {
    callback(event.detail.key, event.detail.value);
  };
  
  window.addEventListener('storage-change', handler as EventListener);
  
  // Also listen for Firebase changes if available
  const firebaseKeys = ["users", "clients", "plans"];
  const firebaseUnsubscribes = addFirebaseListeners(firebaseKeys, (key, value) => {
    // Update localStorage as cache
    saveToLocalStorage(key, value);
    // Notify the change
    callback(key, value);
  });
  
  // Return a function that removes all listeners
  return () => {
    window.removeEventListener('storage-change', handler as EventListener);
    firebaseUnsubscribes.forEach(unsubscribe => unsubscribe());
  };
};

/**
 * Check connection and return boolean status
 */
export const checkConnection = async (): Promise<boolean> => {
  try {
    const isConnected = await isFirebaseConnected();
    if (!isConnected) {
      console.warn("Sem conexão com o banco de dados. Verificação retornou false.");
    }
    return isConnected;
  } catch (error) {
    console.error("Erro ao verificar conexão:", error);
    return false;
  }
};

/**
 * Initialize default data
 */
export const initializeData = async (): Promise<boolean> => {
  try {
    await initializeDefaultData();
    return true;
  } catch (error) {
    console.error("Erro ao inicializar dados padrão:", error);
    return false;
  }
};
