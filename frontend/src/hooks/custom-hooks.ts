import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useOriginToNavigationState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state && location.state.origin !== 'self') {
      navigate(location.pathname, {
        replace: true,
        state: { ...(location.state || {}), origin: 'self' },
      });
    }
  }, [location, navigate]);
};

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
