
/**
 * Utilitário para sincronizar dados entre diferentes navegadores
 * usando Firebase Realtime Database para armazenamento em nuvem
 * e localStorage como backup
 */
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, remove, Database } from "firebase/database";

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
let app;
let database: Database | null = null;
let firebaseInitialized = false;

// Função para inicializar o Firebase de forma controlada
const initializeFirebase = () => {
  if (firebaseInitialized) return database;
  
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    firebaseInitialized = true;
    console.log("Firebase inicializado com sucesso");
    return database;
  } catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
    firebaseInitialized = false;
    database = null;
    return null;
  }
};

// Tenta inicializar o Firebase imediatamente
initializeFirebase();

// Verifica a conexão com o Firebase
const checkFirebaseConnection = async (): Promise<boolean> => {
  if (!database) {
    database = initializeFirebase();
    if (!database) return false;
  }
  
  try {
    // Tenta fazer uma operação simples para verificar a conexão
    const testRef = ref(database, ".info/connected");
    const snapshot = await get(testRef);
    return snapshot.exists() && snapshot.val() === true;
  } catch (error) {
    console.error("Erro ao verificar conexão com Firebase:", error);
    return false;
  }
};

export const syncStorage = {
  // Dados em memória que podem ser acessados durante a sessão atual
  memoryStorage: new Map<string, any>(),
  
  // Flag para indicar se está operando em modo offline
  isOfflineMode: false,
  
  // Configura o modo offline
  setOfflineMode: (offline: boolean) => {
    syncStorage.isOfflineMode = offline;
    if (offline) {
      console.log("Operando em modo offline");
    } else {
      console.log("Operando em modo online");
    }
  },

  // Armazena dados com timestamp
  setItem: async <T>(key: string, value: T): Promise<void> => {
    try {
      const event = {
        timestamp: Date.now(),
        data: value,
      };
      
      // Armazena no localStorage como backup
      localStorage.setItem(key, JSON.stringify(event));
      
      // Armazena também em memória para acesso rápido
      syncStorage.memoryStorage.set(key, value);
      
      // Se estiver em modo offline, não tenta sincronizar com o Firebase
      if (syncStorage.isOfflineMode) {
        window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value } }));
        return;
      }
      
      // Verifica a conexão antes de tentar sincronizar
      const isConnected = await checkFirebaseConnection();
      
      // Armazena no Firebase Realtime Database se disponível e conectado
      if (isConnected && database) {
        const dbRef = ref(database, key);
        await set(dbRef, event);
        console.log(`Dados sincronizados com Firebase: ${key}`);
      } else {
        console.warn(`Firebase indisponível, dados armazenados apenas localmente: ${key}`);
      }
      
      // Notifica sobre a mudança (útil para sincronizar componentes)
      window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value } }));
    } catch (error) {
      console.error("Erro ao armazenar dados:", error);
      // Garante que mesmo com erro, os dados estão no localStorage
      const event = {
        timestamp: Date.now(),
        data: value,
      };
      localStorage.setItem(key, JSON.stringify(event));
    }
  },

  // Obtém dados do armazenamento
  getItem: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      // Tenta obter do armazenamento em memória primeiro (mais rápido)
      if (syncStorage.memoryStorage.has(key)) {
        return syncStorage.memoryStorage.get(key);
      }
      
      // Se estiver em modo offline, usa apenas localStorage
      if (syncStorage.isOfflineMode) {
        const localData = syncStorage.getItemFromLocalStorage<T>(key, defaultValue);
        return localData;
      }
      
      // Verifica a conexão antes de tentar obter do Firebase
      const isConnected = await checkFirebaseConnection();
      
      // Se o Firebase não estiver disponível ou não conectado, usa o localStorage
      if (!isConnected || !database) {
        syncStorage.setOfflineMode(true);
        const localData = syncStorage.getItemFromLocalStorage<T>(key, defaultValue);
        return localData;
      }
      
      // Se Firebase disponível e conectado, obtém de lá
      try {
        const dbRef = ref(database, key);
        const snapshot = await Promise.race([
          get(dbRef),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Timeout ao buscar dados do Firebase")), 5000)
          )
        ]);
        
        if (snapshot && snapshot.exists()) {
          const event = snapshot.val();
          // Armazena na memória para acesso rápido futuro
          syncStorage.memoryStorage.set(key, event.data);
          // Atualiza o localStorage como backup
          localStorage.setItem(key, JSON.stringify(event));
          return event.data;
        } else {
          // Se não existir no Firebase, tenta obter do localStorage
          const localData = syncStorage.getItemFromLocalStorage<T>(key, defaultValue);
          
          // Se encontrou dados no localStorage, sincroniza com o Firebase
          if (localData !== defaultValue && database) {
            const event = {
              timestamp: Date.now(),
              data: localData,
            };
            
            const dbRef = ref(database, key);
            set(dbRef, event).catch(error => {
              console.error(`Erro ao sincronizar ${key} com Firebase:`, error);
            });
          }
          
          return localData;
        }
      } catch (error) {
        console.error("Erro ao obter dados do Firebase:", error);
        syncStorage.setOfflineMode(true);
        
        // Tenta do localStorage como fallback
        const localData = syncStorage.getItemFromLocalStorage<T>(key, defaultValue);
        return localData;
      }
    } catch (error) {
      console.error("Erro ao recuperar dados armazenados:", error);
      return defaultValue;
    }
  },
  
  // Função auxiliar para obter dados do localStorage
  getItemFromLocalStorage: <T>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    
    try {
      const event = JSON.parse(stored);
      syncStorage.memoryStorage.set(key, event.data);
      return event.data;
    } catch (e) {
      console.error("Erro ao interpretar dados do localStorage:", e);
      return defaultValue;
    }
  },

  // Versão síncrona de getItem (para compatibilidade com código existente)
  getItemSync: <T>(key: string, defaultValue: T): T => {
    try {
      // Tenta obter do armazenamento em memória primeiro (mais rápido)
      if (syncStorage.memoryStorage.has(key)) {
        return syncStorage.memoryStorage.get(key);
      }
      
      // Se não estiver em memória, obtém do localStorage
      return syncStorage.getItemFromLocalStorage(key, defaultValue);
    } catch (error) {
      console.error("Erro ao recuperar dados armazenados:", error);
      return defaultValue;
    }
  },

  // Remove item do armazenamento
  removeItem: async (key: string): Promise<void> => {
    try {
      localStorage.removeItem(key);
      syncStorage.memoryStorage.delete(key);
      
      // Se estiver em modo offline, não tenta remover do Firebase
      if (syncStorage.isOfflineMode) {
        window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value: null } }));
        return;
      }
      
      // Verifica a conexão antes de tentar remover do Firebase
      const isConnected = await checkFirebaseConnection();
      
      // Remove do Firebase se disponível e conectado
      if (isConnected && database) {
        const dbRef = ref(database, key);
        await remove(dbRef);
      }
      
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
    
    // Também ouvir mudanças do Firebase se disponível
    const unsubscribeCallbacks: (() => void)[] = [];
    
    if (!syncStorage.isOfflineMode && database) {
      // Ouvir mudanças nos dados comuns
      ["users", "clients", "plans"].forEach(key => {
        const dbRef = ref(database!, key);
        const unsubscribe = onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const event = snapshot.val();
            // Atualiza a memória e o localStorage
            syncStorage.memoryStorage.set(key, event.data);
            localStorage.setItem(key, JSON.stringify(event));
            // Notifica a mudança
            callback(key, event.data);
          }
        }, (error) => {
          console.error(`Erro ao ouvir mudanças em ${key}:`, error);
        });
        
        unsubscribeCallbacks.push(unsubscribe);
      });
    }
    
    // Retorna uma função que remove todos os listeners
    return () => {
      window.removeEventListener('storage-change', handler as EventListener);
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  },
  
  // Verifica conexão e atualiza o modo offline
  checkConnection: async (): Promise<boolean> => {
    try {
      const isConnected = await checkFirebaseConnection();
      syncStorage.setOfflineMode(!isConnected);
      return isConnected;
    } catch (error) {
      console.error("Erro ao verificar conexão:", error);
      syncStorage.setOfflineMode(true);
      return false;
    }
  },
  
  // Inicializa dados locais se necessário
  initializeDefaultData: async () => {
    try {
      // Verifica se já existem usuários
      const users = await syncStorage.getItem("users", []);
      if (!users || users.length === 0) {
        // Cria usuário admin padrão para primeiro acesso
        const adminUser = {
          id: 1,
          username: "admin",
          password: "admin",
          name: "Administrador",
          isAdmin: true,
          permissions: ["view_clients", "edit_clients", "print_clients", "delete_data", "manage_plans", "manage_users"]
        };
        
        await syncStorage.setItem("users", [adminUser]);
        console.log("Usuário admin padrão criado com sucesso");
      }
      
      // Verifica se já existem planos
      const plans = await syncStorage.getItem("plans", []);
      if (!plans || plans.length === 0) {
        // Cria planos padrão
        const defaultPlans = [
          {
            id: 1,
            name: "Plano Básico",
            price: 79.90,
            description: "Internet de 50 Mbps"
          },
          {
            id: 2,
            name: "Plano Intermediário",
            price: 99.90,
            description: "Internet de 100 Mbps"
          },
          {
            id: 3,
            name: "Plano Premium",
            price: 129.90,
            description: "Internet de 200 Mbps"
          }
        ];
        
        await syncStorage.setItem("plans", defaultPlans);
        console.log("Planos padrão criados com sucesso");
      }
    } catch (error) {
      console.error("Erro ao inicializar dados padrão:", error);
    }
  }
};

// Inicializa o sistema na carga do módulo
(async () => {
  try {
    // Verifica a conexão inicial
    await syncStorage.checkConnection();
    
    // Inicializa dados padrão se necessário
    await syncStorage.initializeDefaultData();
  } catch (error) {
    console.error("Erro na inicialização do syncStorage:", error);
    syncStorage.setOfflineMode(true);
  }
})();
