
/**
 * Storage synchronization manager
 */
import { setItem, getItem, getItemSync, removeItem, clear } from "./storageOperations";
import { addChangeListener } from "./eventManager";
import { checkConnection } from "./connectionManager";
import { initializeDefaultData } from "./initializationManager";

// Export all functions
export {
  setItem,
  getItem,
  getItemSync,
  removeItem,
  clear,
  addChangeListener,
  checkConnection,
  initializeDefaultData
};
