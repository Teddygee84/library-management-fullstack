import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Initialize state from localStorage (or use initialValue)
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.error('Error reading localStorage:', err);
      return initialValue;
    }
  });

  // Save to localStorage whenever value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;