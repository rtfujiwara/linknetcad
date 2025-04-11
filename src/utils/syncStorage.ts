
/**
 * Utilitário para sincronizar dados entre diferentes navegadores
 * usando Firebase Realtime Database para armazenamento em nuvem
 * e localStorage como backup
 */
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, remove } from "firebase/database";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyByBgofJhNi6rgmAMl5EHM7aeWQ4JSOGZk",
  authDomain: "linknet-vale.firebaseapp.com",
  databaseURL: "https://linknet-vale-default-rtdb.firebaseio.com",
  projectId: "linknet-vale",
  storageBucket: "linknet-vale.appspot.com",
  messagingSenderId: "647631383499",
  appId: "1:647631383499:web:6dbeecbe7e6cc3e5a41e73"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const syncStorage = {
  // Dados em memória que podem ser acessados durante a sessão atual
  memoryStorage: new Map<string, any>(),

  // Armazena dados com timestamp
  setItem: <T>(key: string, value: T): void => {
    try {
      const event = {
        timestamp: Date.now(),
        data: value,
      };
      
      // Armazena no localStorage como backup
      localStorage.setItem(key, JSON.stringify(event));
      
      // Armazena também em memória para acesso rápido
      syncStorage.memoryStorage.set(key, value);
      
      // Armazena no Firebase Realtime Database
      const dbRef = ref(database, key);
      set(dbRef, event);
      
      // Notifica sobre a mudança (útil para sincronizar componentes)
      window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value } }));
      
      console.log(`Dados armazenados: ${key}`);
    } catch (error) {
      console.error("Erro ao armazenar dados:", error);
    }
  },

  // Obtém dados do armazenamento
  getItem: <T>(key: string, defaultValue: T): Promise<T> => {
    return new Promise((resolve) => {
      try {
        // Tenta obter do armazenamento em memória primeiro (mais rápido)
        if (syncStorage.memoryStorage.has(key)) {
          resolve(syncStorage.memoryStorage.get(key));
          return;
        }
        
        // Se não estiver em memória, obtém do Firebase
        const dbRef = ref(database, key);
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            const event = snapshot.val();
            // Armazena na memória para acesso rápido futuro
            syncStorage.memoryStorage.set(key, event.data);
            // Atualiza o localStorage como backup
            localStorage.setItem(key, JSON.stringify(event));
            resolve(event.data);
          } else {
            // Se não existir no Firebase, tenta obter do localStorage
            const stored = localStorage.getItem(key);
            if (!stored) {
              resolve(defaultValue);
              return;
            }
            
            try {
              const event = JSON.parse(stored);
              // Armazena na memória para acesso rápido futuro
              syncStorage.memoryStorage.set(key, event.data);
              // Sincroniza com o Firebase
              set(dbRef, event);
              resolve(event.data);
            } catch (e) {
              console.error("Erro ao interpretar dados armazenados:", e);
              resolve(defaultValue);
            }
          }
        }).catch((error) => {
          console.error("Erro ao obter dados do Firebase:", error);
          resolve(defaultValue);
        });
      } catch (error) {
        console.error("Erro ao recuperar dados armazenados:", error);
        resolve(defaultValue);
      }
    });
  },

  // Versão síncrona de getItem (para compatibilidade com código existente)
  getItemSync: <T>(key: string, defaultValue: T): T => {
    try {
      // Tenta obter do armazenamento em memória primeiro (mais rápido)
      if (syncStorage.memoryStorage.has(key)) {
        return syncStorage.memoryStorage.get(key);
      }
      
      // Se não estiver em memória, obtém do localStorage
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;
      
      const event = JSON.parse(stored);
      
      // Armazena na memória para acesso rápido futuro
      syncStorage.memoryStorage.set(key, event.data);
      
      return event.data;
    } catch (error) {
      console.error("Erro ao recuperar dados armazenados:", error);
      return defaultValue;
    }
  },

  // Remove item do armazenamento
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
      syncStorage.memoryStorage.delete(key);
      
      // Remove do Firebase
      const dbRef = ref(database, key);
      remove(dbRef);
      
      // Notifica sobre a remoção
      window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value: null } }));
    } catch (error) {
      console.error("Erro ao remover dados:", error);
    }
  },
  
  // Limpa todos os itens
  clear: (): void => {
    try {
      localStorage.clear();
      syncStorage.memoryStorage.clear();
      
      // Limpa dados no Firebase (não implementado para evitar limpar tudo acidentalmente)
      // Notifica sobre a limpeza
      window.dispatchEvent(new CustomEvent('storage-change', { detail: { key: null, value: null } }));
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
    }
  },
  
  // Adiciona um listener para mudanças no armazenamento
  addChangeListener: (callback: (key: string, value: any) => void): (() => void) => {
    const handler = (event: CustomEvent) => {
      callback(event.detail.key, event.detail.value);
    };
    
    window.addEventListener('storage-change', handler as EventListener);
    
    // Também ouvir mudanças do Firebase
    const unsubscribeCallbacks: (() => void)[] = [];
    
    // Ouvir mudanças nos dados comuns
    ["users", "clients", "plans"].forEach(key => {
      const dbRef = ref(database, key);
      const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const event = snapshot.val();
          // Atualiza a memória e o localStorage
          syncStorage.memoryStorage.set(key, event.data);
          localStorage.setItem(key, JSON.stringify(event));
          // Notifica a mudança
          callback(key, event.data);
        }
      });
      unsubscribeCallbacks.push(unsubscribe);
    });
    
    // Retorna uma função que remove todos os listeners
    return () => {
      window.removeEventListener('storage-change', handler as EventListener);
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  }
};
