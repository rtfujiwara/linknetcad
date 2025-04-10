
/**
 * Utilitário para sincronizar dados entre diferentes navegadores
 * usando uma combinação de localStorage e armazenamento em memória
 * com potencial para expansão com uma solução server-side
 */
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
      
      // Armazena no localStorage
      localStorage.setItem(key, JSON.stringify(event));
      
      // Armazena também em memória para acesso rápido
      syncStorage.memoryStorage.set(key, value);
      
      // Notifica sobre a mudança (útil para sincronizar componentes)
      window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value } }));
      
      console.log(`Dados armazenados: ${key}`);
    } catch (error) {
      console.error("Erro ao armazenar dados:", error);
    }
  },

  // Obtém dados do armazenamento
  getItem: <T>(key: string, defaultValue: T): T => {
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
  addChangeListener: (callback: (key: string, value: any) => void): void => {
    const handler = (event: CustomEvent) => {
      callback(event.detail.key, event.detail.value);
    };
    
    window.addEventListener('storage-change', handler as EventListener);
    return () => window.removeEventListener('storage-change', handler as EventListener);
  }
};
