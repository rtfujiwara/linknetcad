
/**
 * Storage interface types
 */

export interface StorageInterface {
  /**
   * Save data to storage
   */
  setItem: <T>(key: string, value: T) => Promise<void>;
  
  /**
   * Get data from storage
   */
  getItem: <T>(key: string, defaultValue: T) => Promise<T>;
  
  /**
   * Get data from storage synchronously
   */
  getItemSync: <T>(key: string, defaultValue: T) => T;
  
  /**
   * Remove data from storage
   */
  removeItem: (key: string) => Promise<void>;
  
  /**
   * Clear all data from storage
   */
  clear: () => Promise<void>;
  
  /**
   * Add a change listener
   */
  addChangeListener: (callback: (key: string, value: any) => void) => () => void;
  
  /**
   * Check connection status
   */
  checkConnection: () => Promise<boolean>;
  
  /**
   * Initialize default data
   */
  initializeDefaultData: () => Promise<boolean>;
  
  /**
   * Reset connection check (optional)
   */
  resetConnectionCheck?: () => void;
}
