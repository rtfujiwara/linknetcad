
/**
 * Firebase storage operations module
 */
import { ref, set, get, onValue, remove } from "firebase/database";
import { getFirebaseDatabase, checkFirebaseConnection } from "../firebase/init";

/**
 * Get Firebase database instance safely
 */
const getDatabase = async () => {
  const db = await getFirebaseDatabase();
  return db;
};

/**
 * Save data to Firebase Realtime Database
 */
export const saveToFirebase = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    // Check connection before trying to sync
    const database = await getDatabase();
    
    if (!database) {
      console.warn("Firebase database indisponível, salvando apenas localmente");
      return false;
    }
    
    // Store in Firebase Realtime Database with timestamp
    const event = {
      timestamp: Date.now(),
      data: value,
    };
    
    const dbRef = ref(database, key);
    await set(dbRef, event);
    console.log(`Dados sincronizados com Firebase: ${key}`);
    return true;
  } catch (error) {
    console.error("Erro ao sincronizar com Firebase:", error);
    return false;
  }
};

/**
 * Get data from Firebase Realtime Database
 */
export const getFromFirebase = async <T>(key: string): Promise<{ data: T; exists: boolean }> => {
  try {
    // Check connection before trying to get from Firebase
    const database = await getDatabase();
    
    if (!database) {
      console.warn("Firebase database indisponível, usando apenas dados locais");
      return { data: null as unknown as T, exists: false };
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
      return { data: event.data, exists: true };
    }
    
    return { data: null as unknown as T, exists: false };
  } catch (error) {
    console.warn("Erro ao obter dados do Firebase:", error);
    return { data: null as unknown as T, exists: false };
  }
};

/**
 * Remove data from Firebase Realtime Database
 */
export const removeFromFirebase = async (key: string): Promise<boolean> => {
  try {
    // Check connection before trying to remove from Firebase
    const database = await getDatabase();
    
    if (!database) {
      console.warn("Firebase database indisponível, removendo apenas localmente");
      return false;
    }
    
    // Remove from Firebase
    const dbRef = ref(database, key);
    await remove(dbRef);
    return true;
  } catch (error) {
    console.error("Erro ao remover dados do Firebase:", error);
    return false;
  }
};

/**
 * Add Firebase change listeners
 */
export const addFirebaseListeners = async (keys: string[], callback: (key: string, value: any) => void): Promise<(() => void)[]> => {
  const unsubscribeCallbacks: (() => void)[] = [];
  
  try {
    const database = await getDatabase();
    
    if (!database) {
      return unsubscribeCallbacks;
    }
    
    // Listen for changes in specified keys
    keys.forEach(key => {
      const dbRef = ref(database, key);
      const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const event = snapshot.val();
          callback(key, event.data);
        }
      }, (error) => {
        console.error(`Erro ao ouvir mudanças em ${key}:`, error);
      });
      
      unsubscribeCallbacks.push(unsubscribe);
    });
  } catch (error) {
    console.warn("Não foi possível configurar listeners do Firebase:", error);
  }
  
  return unsubscribeCallbacks;
};

/**
 * Check Firebase connection
 */
export const isFirebaseConnected = async (): Promise<boolean> => {
  try {
    return await checkFirebaseConnection();
  } catch (error) {
    console.error("Erro ao verificar conexão Firebase:", error);
    return false;
  }
};
