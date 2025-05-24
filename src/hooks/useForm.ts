import { useState, SetStateAction } from 'react';

export function useForm<T extends Record<string, string>>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);

  const setFieldValue = <K extends keyof T>(
    field: K,
    value: SetStateAction<T[K]>
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]:
        typeof value === 'function'
          ? (value as (prevState: T[K]) => T[K])(prev[field])
          : value
    }));
  };

  return { values, setFieldValue };
}
