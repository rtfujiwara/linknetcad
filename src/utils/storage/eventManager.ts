
/**
 * Storage event management module
 */
import { saveToLocalStorage } from "./localStorageHelpers";
import { addFirebaseListeners } from "./firebaseStorage";

/**
 * Notify about storage changes
 */
export const notifyChange = (key: string, value: any): void => {
  window.dispatchEvent(new CustomEvent('storage-change', { detail: { key, value } }));
};

/**
 * Add a listener for storage changes
 */
export const addChangeListener = (callback: (key: string, value: any) => void): (() => void) => {
  const handler = (event: CustomEvent) => {
    callback(event.detail.key, event.detail.value);
  };
  
  window.addEventListener('storage-change', handler as EventListener);
  
  // Also listen for Firebase changes if available
  const firebaseKeys = ["users", "clients", "plans"];
  const firebaseUnsubscribes = addFirebaseListeners(firebaseKeys, (key, value) => {
    // Update localStorage as cache
    saveToLocalStorage(key, value);
    // Notify the change
    callback(key, value);
  });
  
  // Return a function that removes all listeners
  return () => {
    window.removeEventListener('storage-change', handler as EventListener);
    firebaseUnsubscribes.forEach(unsubscribe => unsubscribe());
  };
};
