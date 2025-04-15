
/**
 * Data initialization management module
 */
import { initializeDefaultData as initializeDefaults } from "./defaultData";

// Flag para evitar inicializações repetidas
let defaultDataInitialized = false;

/**
 * Initialize default data
 */
export const initializeDefaultData = async (): Promise<boolean> => {
  if (defaultDataInitialized) {
    return true; // Previne inicializações repetidas
  }
  
  try {
    await initializeDefaults();
    defaultDataInitialized = true;
    return true;
  } catch (error) {
    console.error("Erro ao inicializar dados padrão:", error);
    return false;
  }
};
