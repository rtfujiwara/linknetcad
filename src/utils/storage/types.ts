
/**
 * Storage types definitions
 */

export type StorageEvent<T> = {
  timestamp: number;
  data: T;
};

export interface StorageInterface {
  setItem: <T>(key: string, value: T) => Promise<void>;
  getItem: <T>(key: string, defaultValue: T) => Promise<T>;
  getItemSync: <T>(key: string, defaultValue: T) => T;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  addChangeListener: (callback: (key: string, value: any) => void) => (() => void);
  checkConnection: () => Promise<boolean>; // Changed from Promise<void> to Promise<boolean>
  initializeDefaultData: () => Promise<boolean>; // Changed from Promise<void> to Promise<boolean>
}
