import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing a value.
 * Explainations: Debouncing ensures that a function is not called too frequently.
 * In search, it waits until the user has stopped typing for a specific delay (e.g., 500ms) 
 * before actually sending the API request. This prevents unnecessary API calls
 * on every single keystroke.
 * 
 * @param {string} value The value to debounce
 * @param {number} delay The delay in milliseconds
 * @returns {string} The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: If value changes before delay finishes, clear the timer
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
