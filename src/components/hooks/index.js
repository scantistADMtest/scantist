import { useState, useEffect } from "react";

export function useDebounce(value = "", delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
