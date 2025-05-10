
/**
 * Data initialization management module
 */
import { initializeDefaultData as initializeDefaults } from "./defaultData";

// Flag para evitar inicializações repetidas
let defaultDataInitialized = false;
let initializationInProgress = false;
let lastInitialization = 0;

// Intervalo mínimo entre inicializações (5 minutos)
const MIN_INIT_INTERVAL = 5 * 60 * 1000;

/**
 * Initialize default data
 */
export const initializeDefaultData = async (): Promise<boolean> => {
  const now = Date.now();
  
  // Evita inicializações muito frequentes
  if (initializationInProgress) {
    console.log("Inicialização de dados já está em andamento");
    return false;
  }
  
  // Se já inicializou recentemente, não tenta novamente
  if (defaultDataInitialized && (now - lastInitialization < MIN_INIT_INTERVAL)) {
    console.log("Dados já inicializados recentemente");
    return true;
  }
  
  initializationInProgress = true;
  
  try {
    console.log("Iniciando inicialização de dados padrão...");
    await initializeDefaults();
    defaultDataInitialized = true;
    lastInitialization = now;
    console.log("Dados padrão inicializados com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao inicializar dados padrão:", error);
    return false;
  } finally {
    initializationInProgress = false;
  }
};

/**
 * Verificar se os dados já foram inicializados
 */
export const isDataInitialized = (): boolean => {
  return defaultDataInitialized;
};

/**
 * Forçar reinicialização de dados (para uso após reconexão)
 */
export const forceInitialization = async (): Promise<boolean> => {
  defaultDataInitialized = false;
  lastInitialization = 0;
  return initializeDefaultData();
};
