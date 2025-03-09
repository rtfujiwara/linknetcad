
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
    try {
      const event: SyncEvent<T> = {
        timestamp: Date.now(),
        data: value,
      };
      localStorage.setItem(key, JSON.stringify(event));
    } catch (error) {
      console.error("Error storing data:", error);
    }
  },

  // Get data from storage
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;
      
      const event = JSON.parse(stored) as SyncEvent<T>;
      return event.data;
    } catch (error) {
      console.error("Error retrieving stored data:", error);
      return defaultValue;
    }
  },

  // Clear item from storage
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing data:", error);
    }
  }
};
