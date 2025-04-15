
/**
 * Storage operations module
 */
import { saveToLocalStorage, getDataFromLocalStorage, removeFromLocalStorage, clearLocalStorage, getFromLocalStorage } from "./localStorageHelpers";
import { saveToFirebase, getFromFirebase, removeFromFirebase } from "./firebaseStorage";
import { notifyChange } from "./eventManager";
import { checkConnection } from "./connectionManager";

/**
 * Store data with timestamp
 */
export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    // Always save to localStorage first for reliability
    saveToLocalStorage(key, value);
    
    // Try to sync with Firebase if possible with a timeout
    try {
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout ao salvar no Firebase")), 3000);
      });
      
      await Promise.race([saveToFirebase(key, value), timeoutPromise]);
    } catch (error) {
      console.warn("Erro ao sincronizar com Firebase, dados salvos apenas localmente:", error);
    }
    
    // Notify about the change (useful for syncing components)
    notifyChange(key, value);
  } catch (error) {
    console.error("Erro ao armazenar dados:", error);
    // Even if there's an error with Firebase, we've saved to localStorage
  }
};

/**
 * Get data from storage
 */
export const getItem = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    // Always try from localStorage first for performance and offline support
    const localData = getDataFromLocalStorage(key, defaultValue);
    
    // Se já temos dados locais e há uma verificação de conexão em andamento, 
    // retorne os dados locais imediatamente para evitar loops
    if (localData !== defaultValue && connectionCheckInProgress) {
      return localData;
    }
    
    try {
      // Try to get from Firebase with a timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Tempo esgotado ao buscar dados do banco de dados")), 3000);
      });
      
      const firebasePromise = getFromFirebase<T>(key);
      const { data, exists } = await Promise.race([firebasePromise, timeoutPromise.then(() => {
        throw new Error("Timeout getting data from Firebase");
      })]);
      
      if (exists) {
        // Update the localStorage as cache
        saveToLocalStorage(key, data);
        return data;
      } else if (localData !== defaultValue) {
        // If we have data locally but not in Firebase, sync to Firebase
        try {
          await setItem(key, localData);
        } catch (e) {
          console.warn("Falha ao sincronizar dados locais com Firebase:", e);
        }
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
    
    // Try to remove from Firebase with a timeout
    try {
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout ao remover do Firebase")), 3000);
      });
      
      await Promise.race([removeFromFirebase(key), timeoutPromise]);
    } catch (error) {
      console.warn("Erro ao remover do Firebase, removido apenas localmente:", error);
    }
    
    // Notify about the removal
    notifyChange(key, null);
  } catch (error) {
    console.error("Erro ao remover dados:", error);
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

// Flag para controlar verificações de conexão simultâneas
let connectionCheckInProgress = false;
