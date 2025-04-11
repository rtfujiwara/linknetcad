
/**
 * Utilitário para sincronizar dados entre diferentes navegadores
 * usando Firebase Realtime Database para armazenamento em nuvem
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
    throw new Error("Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.");
  }
};

// Tenta inicializar o Firebase imediatamente
try {
  initializeFirebase();
} catch (error) {
  console.error("Erro na inicialização inicial do Firebase:", error);
}

// Verifica a conexão com o Firebase
const checkFirebaseConnection = async (): Promise<boolean> => {
  if (!database) {
    try {
      database = initializeFirebase();
      if (!database) return false;
    } catch (error) {
      throw new Error("Não foi possível estabelecer conexão com o banco de dados.");
    }
  }
  
  try {
    // Tenta fazer uma operação simples para verificar a conexão
    const testRef = ref(database, ".info/connected");
    const snapshot = await get(testRef);
    return snapshot.exists() && snapshot.val() === true;
  } catch (error) {
    console.error("Erro ao verificar conexão com Firebase:", error);
    throw new Error("Erro de conexão com o banco de dados. Verifique sua internet e tente novamente.");
  }
};

export const syncStorage = {
  // Armazena dados com timestamp
  setItem: async <T>(key: string, value: T): Promise<void> => {
    try {
      const event = {
        timestamp: Date.now(),
        data: value,
      };
      
      // Verifica a conexão antes de tentar sincronizar
      if (!database) {
        await initializeFirebase();
      }
      
      if (!database) {
        throw new Error("Não foi possível conectar ao banco de dados.");
      }
      
      // Armazena no Firebase Realtime Database
      const dbRef = ref(database, key);
      await set(dbRef, event);
      console.log(`Dados sincronizados com Firebase: ${key}`);
      
      // Armazena em localStorage apenas como cache temporário
      localStorage.setItem(key, JSON.stringify(event));
      
      // Notifica sobre a mudança (útil para sincronizar componentes)
      window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value } }));
    } catch (error) {
      console.error("Erro ao armazenar dados:", error);
      throw new Error("Não foi possível salvar os dados. Verifique sua conexão com a internet e tente novamente.");
    }
  },

  // Obtém dados do armazenamento
  getItem: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      // Verifica a conexão antes de tentar obter do Firebase
      if (!database) {
        await initializeFirebase();
      }
      
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
          // Atualiza o localStorage como cache
          localStorage.setItem(key, JSON.stringify(event));
          return event.data;
        } else {
          // Se não existir no Firebase, verifica se existe localmente para sincronizar
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const event = JSON.parse(stored);
              // Sincroniza com o Firebase
              const dbRef = ref(database, key);
              await set(dbRef, {
                timestamp: Date.now(),
                data: event.data
              });
              return event.data;
            } catch (e) {
              console.error("Erro ao interpretar dados do localStorage:", e);
            }
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
  
  // Versão síncrona apenas para compatibilidade (sempre tenta primeiro do Firebase)
  getItemSync: <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;
      
      try {
        const event = JSON.parse(stored);
        return event.data;
      } catch (e) {
        console.error("Erro ao interpretar dados do cache local:", e);
        return defaultValue;
      }
    } catch (error) {
      console.error("Erro ao recuperar dados do cache:", error);
      return defaultValue;
    }
  },

  // Remove item do armazenamento
  removeItem: async (key: string): Promise<void> => {
    try {
      // Remove do localStorage
      localStorage.removeItem(key);
      
      // Verifica a conexão antes de tentar remover do Firebase
      if (!database) {
        await initializeFirebase();
      }
      
      if (!database) {
        throw new Error("Não foi possível conectar ao banco de dados.");
      }
      
      // Remove do Firebase
      const dbRef = ref(database, key);
      await remove(dbRef);
      
      // Notifica sobre a remoção
      window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value: null } }));
    } catch (error) {
      console.error("Erro ao remover dados:", error);
      throw new Error("Não foi possível remover os dados. Verifique sua conexão com a internet.");
    }
  },
  
  // Limpa todos os itens
  clear: async (): Promise<void> => {
    try {
      localStorage.clear();
      
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
    
    if (database) {
      // Ouvir mudanças nos dados comuns
      ["users", "clients", "plans"].forEach(key => {
        const dbRef = ref(database!, key);
        const unsubscribe = onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const event = snapshot.val();
            // Atualiza o localStorage como cache
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
  
  // Verifica conexão e rejeita caso não esteja conectado
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
  
  // Inicializa dados padrão
  initializeDefaultData: async () => {
    try {
      await checkFirebaseConnection();
      
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
      throw new Error("Não foi possível inicializar os dados padrão. Verifique sua conexão com a internet.");
    }
  }
};

// Inicializa o sistema na carga do módulo
(async () => {
  try {
    // Verifica a conexão inicial e inicializa dados padrão
    await syncStorage.checkConnection();
    await syncStorage.initializeDefaultData();
  } catch (error) {
    console.error("Erro na inicialização do syncStorage:", error);
  }
})();
