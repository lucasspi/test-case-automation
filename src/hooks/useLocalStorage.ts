import { useState, useEffect } from 'react';

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // Get value from localStorage or use initial value
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  // Function to update the value
  const setStoredValue = (newValue: T) => {
    setValue(newValue);
  };

  // Function to remove the value
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return {
    value,
    setValue: setStoredValue,
    removeValue
  };
}
