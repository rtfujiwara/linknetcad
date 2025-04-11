
/**
 * Local storage helper functions
 */
import { StorageEvent } from "./types";

/**
 * Save data to local storage
 */
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const event: StorageEvent<T> = {
      timestamp: Date.now(),
      data: value,
    };
    localStorage.setItem(key, JSON.stringify(event));
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
  }
};

/**
 * Get data from local storage
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): StorageEvent<T> | null => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    return JSON.parse(stored) as StorageEvent<T>;
  } catch (error) {
    console.error("Erro ao obter dados do localStorage:", error);
    return null;
  }
};

/**
 * Get data directly from local storage
 */
export const getDataFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const event = getFromLocalStorage(key, defaultValue);
    return event ? event.data : defaultValue;
  } catch (error) {
    console.error("Erro ao obter dados do localStorage:", error);
    return defaultValue;
  }
};

/**
 * Remove data from local storage
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Erro ao remover do localStorage:", error);
  }
};

/**
 * Clear all data from local storage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Erro ao limpar localStorage:", error);
  }
};
