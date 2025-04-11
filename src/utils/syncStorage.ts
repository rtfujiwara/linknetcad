
/**
 * Synchronization storage utility for Firebase Realtime Database
 */
import { ref, set, get, onValue, remove } from "firebase/database";
import { initializeFirebase, getFirebaseDatabase, checkFirebaseConnection } from "./firebase/init";
import { saveToLocalStorage, getFromLocalStorage, getDataFromLocalStorage, removeFromLocalStorage, clearLocalStorage } from "./storage/localStorageHelpers";
import { StorageInterface } from "./storage/types";
import { initializeDefaultData } from "./storage/defaultData";

export const syncStorage: StorageInterface = {
  // Store data with timestamp
  setItem: async <T>(key: string, value: T): Promise<void> => {
    try {
      const event = {
        timestamp: Date.now(),
        data: value,
      };
      
      // Check connection before trying to sync
      const database = getFirebaseDatabase();
      
      if (!database) {
        throw new Error("Não foi possível conectar ao banco de dados.");
      }
      
      // Store in Firebase Realtime Database
      const dbRef = ref(database, key);
      await set(dbRef, event);
      console.log(`Dados sincronizados com Firebase: ${key}`);
      
      // Store in localStorage as temporary cache
      saveToLocalStorage(key, value);
      
      // Notify about the change (useful for syncing components)
      window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value } }));
    } catch (error) {
      console.error("Erro ao armazenar dados:", error);
      throw new Error("Não foi possível salvar os dados. Verifique sua conexão com a internet e tente novamente.");
    }
  },

  // Get data from storage
  getItem: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      // Check connection before trying to get from Firebase
      const database = getFirebaseDatabase();
      
      if (!database) {
        throw new Error("Não foi possível conectar ao banco de dados.");
      }
      
      try {
        const dbRef = ref(database, key);
        const snapshot = await Promise.race([
          get(dbRef),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Tempo esgotado ao buscar dados do banco de dados")), 10000)
          )
        ]);
        
        if (snapshot && snapshot.exists()) {
          const event = snapshot.val();
          // Update the localStorage as cache
          saveToLocalStorage(key, event.data);
          return event.data;
        } else {
          // If not in Firebase, check if exists locally to sync
          const storedEvent = getFromLocalStorage(key, defaultValue);
          if (storedEvent) {
            // Sync with Firebase
            const dbRef = ref(database, key);
            await set(dbRef, {
              timestamp: Date.now(),
              data: storedEvent.data
            });
            return storedEvent.data;
          }
          return defaultValue;
        }
      } catch (error) {
        console.error("Erro ao obter dados do Firebase:", error);
        throw new Error("Não foi possível carregar os dados. Verifique sua conexão com a internet e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao recuperar dados armazenados:", error);
      throw new Error("Erro ao recuperar dados. Por favor, verifique sua conexão e tente novamente.");
    }
  },
  
  // Synchronous version for compatibility (always tries first from localStorage)
  getItemSync: <T>(key: string, defaultValue: T): T => {
    return getDataFromLocalStorage(key, defaultValue);
  },

  // Remove item from storage
  removeItem: async (key: string): Promise<void> => {
    try {
      // Remove from localStorage
      removeFromLocalStorage(key);
      
      // Check connection before trying to remove from Firebase
      const database = getFirebaseDatabase();
      
      if (!database) {
        throw new Error("Não foi possível conectar ao banco de dados.");
      }
      
      // Remove from Firebase
      const dbRef = ref(database, key);
      await remove(dbRef);
      
      // Notify about the removal
      window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value: null } }));
    } catch (error) {
      console.error("Erro ao remover dados:", error);
      throw new Error("Não foi possível remover os dados. Verifique sua conexão com a internet.");
    }
  },
  
  // Clear all items
  clear: async (): Promise<void> => {
    try {
      clearLocalStorage();
      
      // Notify about the clearing
      window.dispatchEvent(new CustomEvent('storage-change', { detail: { key: null, value: null } }));
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
    }
  },
  
  // Add a listener for storage changes
  addChangeListener: (callback: (key: string, value: any) => void): (() => void) => {
    const handler = (event: CustomEvent) => {
      callback(event.detail.key, event.detail.value);
    };
    
    window.addEventListener('storage-change', handler as EventListener);
    
    // Also listen for Firebase changes if available
    const unsubscribeCallbacks: (() => void)[] = [];
    const database = getFirebaseDatabase();
    
    if (database) {
      // Listen for changes in common data
      ["users", "clients", "plans"].forEach(key => {
        const dbRef = ref(database, key);
        const unsubscribe = onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const event = snapshot.val();
            // Update localStorage as cache
            saveToLocalStorage(key, event.data);
            // Notify the change
            callback(key, event.data);
          }
        }, (error) => {
          console.error(`Erro ao ouvir mudanças em ${key}:`, error);
        });
        
        unsubscribeCallbacks.push(unsubscribe);
      });
    }
    
    // Return a function that removes all listeners
    return () => {
      window.removeEventListener('storage-change', handler as EventListener);
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  },
  
  // Check connection and reject if not connected
  checkConnection: async (): Promise<boolean> => {
    try {
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        throw new Error("Sem conexão com o banco de dados. Verifique sua internet e tente novamente.");
      }
      return true;
    } catch (error) {
      console.error("Erro ao verificar conexão:", error);
      throw error;
    }
  },
  
  // Initialize default data
  initializeDefaultData: async () => {
    await initializeDefaultData();
  }
};

// Initialize the system on module load
(async () => {
  try {
    // Check initial connection and initialize default data
    await syncStorage.checkConnection();
    await syncStorage.initializeDefaultData();
  } catch (error) {
    console.error("Erro na inicialização do syncStorage:", error);
  }
})();
