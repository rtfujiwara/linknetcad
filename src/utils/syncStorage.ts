
interface SyncEvent<T> {
  timestamp: number;
  data: T;
}

/**
 * A utility to synchronize data across different browsers using a combination of
 * localStorage and an optional server-side solution (could be expanded later)
 */
export const syncStorage = {
  // Store data with timestamp
  setItem: <T>(key: string, value: T): void => {
    const event: SyncEvent<T> = {
      timestamp: Date.now(),
      data: value,
    };
    localStorage.setItem(key, JSON.stringify(event));
  },

  // Get data from storage
  getItem: <T>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    
    try {
      const event = JSON.parse(stored) as SyncEvent<T>;
      return event.data;
    } catch (error) {
      console.error("Error parsing stored data:", error);
      return defaultValue;
    }
  },

  // Clear item from storage
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
};
