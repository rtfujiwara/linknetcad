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
      
      // Always save to localStorage first for reliability
      saveToLocalStorage(key, value);
      
      // Try to sync with Firebase if possible
      try {
        // Check connection before trying to sync
        const database = getFirebaseDatabase();
        
        if (!database) {
          console.warn("Firebase database indisponível, salvando apenas localmente");
          return;
        }
        
        // Store in Firebase Realtime Database
        const dbRef = ref(database, key);
        await set(dbRef, event);
        console.log(`Dados sincronizados com Firebase: ${key}`);
        
        // Notify about the change (useful for syncing components)
        window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value } }));
      } catch (error) {
        console.error("Erro ao sincronizar com Firebase:", error);
        // Continue silently in case of sync error, as data is already in localStorage
      }
    } catch (error) {
      console.error("Erro ao armazenar dados:", error);
      throw new Error("Não foi possível salvar os dados. Verifique sua conexão com a internet.");
    }
  },

  // Get data from storage
  getItem: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      // Always try from localStorage first for performance and offline support
      const localData = getDataFromLocalStorage(key, defaultValue);
      
      try {
        // Check connection before trying to get from Firebase
        const database = getFirebaseDatabase();
        
        if (!database) {
          console.warn("Firebase database indisponível, usando apenas dados locais");
          return localData;
        }
        
        // Try to get from Firebase with timeout
        const dbRef = ref(database, key);
        const snapshot = await Promise.race([
          get(dbRef),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Tempo esgotado ao buscar dados do banco de dados")), 5000)
          )
        ]);
        
        if (snapshot && snapshot.exists()) {
          const event = snapshot.val();
          // Update the localStorage as cache
          saveToLocalStorage(key, event.data);
          return event.data;
        } else if (localData !== defaultValue) {
          // If we have data locally but not in Firebase, sync to Firebase
          await syncStorage.setItem(key, localData);
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
      
      try {
        // Check connection before trying to remove from Firebase
        const database = getFirebaseDatabase();
        
        if (!database) {
          console.warn("Firebase database indisponível, removendo apenas localmente");
          return;
        }
        
        // Remove from Firebase
        const dbRef = ref(database, key);
        await remove(dbRef);
        
        // Notify about the removal
        window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value: null } }));
      } catch (error) {
        console.error("Erro ao remover dados do Firebase:", error);
        // Continue silently as data is already removed from localStorage
      }
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
    
    try {
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
    } catch (error) {
      console.warn("Não foi possível configurar listeners do Firebase:", error);
    }
    
    // Return a function that removes all listeners
    return () => {
      window.removeEventListener('storage-change', handler as EventListener);
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  },
  
  // Check connection and return boolean status
  checkConnection: async (): Promise<boolean> => {
    try {
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        console.warn("Sem conexão com o banco de dados. Verificação retornou false.");
      }
      return isConnected;
    } catch (error) {
      console.error("Erro ao verificar conexão:", error);
      return false; // Return false on error instead of throwing
    }
  },
  
  // Initialize default data
  initializeDefaultData: async (): Promise<boolean> => {
    try {
      await initializeDefaultData();
      return true;
    } catch (error) {
      console.error("Erro ao inicializar dados padrão:", error);
      return false; // Return false on error instead of throwing
    }
  }
};

// Initialize the system on module load
(async () => {
  try {
    // Try to initialize Firebase and default data
    initializeFirebase();
    // We'll initialize default data when needed, not on module load
  } catch (error) {
    console.error("Erro na inicialização do syncStorage:", error);
  }
})();
