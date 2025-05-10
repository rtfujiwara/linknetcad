
/**
 * Synchronization storage utility for Firebase Realtime Database
 */
import { initializeFirebase } from "./firebase/init";
import { StorageInterface } from "./storage/types";
import { 
  setItem, 
  getItem, 
  getItemSync, 
  removeItem, 
  clear, 
  addChangeListener, 
  checkConnection, 
  initializeDefaultData 
} from "./storage/syncManager";
import { resetConnectionCheck, startAutoReconnect, stopAutoReconnect } from "./storage/connectionManager";

export const syncStorage: StorageInterface & {
  resetConnectionCheck?: () => void;
  startAutoReconnect?: (callback?: () => void) => void;
  stopAutoReconnect?: () => void;
} = {
  setItem,
  getItem,
  getItemSync,
  removeItem,
  clear,
  addChangeListener,
  checkConnection,
  initializeDefaultData,
  resetConnectionCheck,
  startAutoReconnect,
  stopAutoReconnect
};

// Initialize the system on module load and attempt connection immediately
(async () => {
  try {
    // Try to initialize Firebase immediately with retry
    const maxAttempts = 3;
    let db = null;
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        console.log(`Tentativa ${i+1} de inicializar Firebase na carga do módulo`);
        db = await initializeFirebase();
        if (db) {
          console.log("Firebase inicializado com sucesso na carga do módulo");
          break;
        }
      } catch (err) {
        console.warn(`Tentativa ${i+1} falhou ao inicializar Firebase:`, err);
        // Pequena pausa entre tentativas
        if (i < maxAttempts - 1) {
          await new Promise(r => setTimeout(r, 1000)); // Aumentado para 1s
        }
      }
    }
    
    // Initialize default data in background with fast timeout
    try {
      console.log("Tentando inicializar dados padrão...");
      const initPromise = initializeDefaultData();
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(false), 5000); // Aumentado para 5s
      });
      
      const result = await Promise.race([initPromise, timeoutPromise]);
      console.log("Inicialização de dados padrão:", result ? "Concluída" : "Tempo esgotado");
    } catch (err) {
      console.warn("Erro ao inicializar dados padrão:", err);
    }

    // Inicia reconexão automática
    startAutoReconnect();
  } catch (error) {
    console.error("Erro na inicialização do syncStorage:", error);
  }
})();

// Adiciona um evento para garantir limpeza de recursos ao fechar a página
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    stopAutoReconnect();
  });
}
