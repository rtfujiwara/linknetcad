
/**
 * Storage operations module
 */
import { saveToLocalStorage, getDataFromLocalStorage, removeFromLocalStorage, clearLocalStorage } from "./localStorageHelpers";
import { saveToFirebase, getFromFirebase, removeFromFirebase } from "./firebaseStorage";
import { notifyChange } from "./eventManager";
import { checkConnection } from "./connectionManager";

// Flag para controlar verificações de conexão simultâneas
let connectionCheckInProgress = false;

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
        setTimeout(() => reject(new Error("Timeout ao salvar no Firebase")), 8000); // Aumentado para 8 segundos
      });
      
      const savePromise = (async () => {
        // Tenta verificar conexão primeiro
        const isConnected = await checkConnection();
        
        if (isConnected) {
          await saveToFirebase(key, value);
        } else {
          console.log("Salvando apenas localmente, sem conexão Firebase");
          // Programar sincronização posterior
          window.localStorage.setItem(`sync_pending_${key}`, JSON.stringify({
            timestamp: Date.now(),
            operation: 'set',
            data: value
          }));
        }
      })();
      
      await Promise.race([savePromise, timeoutPromise]);
    } catch (error) {
      console.warn("Erro ao sincronizar com Firebase, dados salvos apenas localmente:", error);
      
      // Marca para sincronização posterior
      window.localStorage.setItem(`sync_pending_${key}`, JSON.stringify({
        timestamp: Date.now(),
        operation: 'set',
        data: value
      }));
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
        setTimeout(() => reject(new Error("Tempo esgotado ao buscar dados do banco de dados")), 8000); // Aumentado para 8 segundos
      });
      
      const firebasePromise = (async () => {
        const isConnected = await checkConnection();
        
        if (!isConnected) {
          console.log(`Usando dados locais para ${key} (sem conexão Firebase)`);
          return { data: localData, exists: localData !== defaultValue };
        }
        
        return getFromFirebase<T>(key);
      })();
      
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
          const isConnected = await checkConnection();
          if (isConnected) {
            await setItem(key, localData);
          }
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
        setTimeout(() => reject(new Error("Timeout ao remover do Firebase")), 8000); // Aumentado para 8 segundos
      });
      
      const removePromise = (async () => {
        const isConnected = await checkConnection();
        if (isConnected) {
          await removeFromFirebase(key);
        } else {
          // Marca para remoção posterior
          window.localStorage.setItem(`sync_pending_${key}`, JSON.stringify({
            timestamp: Date.now(),
            operation: 'remove'
          }));
        }
      })();
      
      await Promise.race([removePromise, timeoutPromise]);
    } catch (error) {
      console.warn("Erro ao remover do Firebase, removido apenas localmente:", error);
      
      // Marca para remoção posterior
      window.localStorage.setItem(`sync_pending_${key}`, JSON.stringify({
        timestamp: Date.now(),
        operation: 'remove'
      }));
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
