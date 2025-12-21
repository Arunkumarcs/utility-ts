/**
 * React State Utilities
 * Utilities for state management patterns
 */

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Hook that provides state with history (undo/redo)
 * @param initialValue - Initial state value
 * @returns State object with value, setValue, undo, redo, canUndo, canRedo
 * @example
 * const state = useHistoryState(0)
 * state.setValue(1)
 * state.undo()
 */
export function useHistoryState<T>(initialValue: T) {
  const [history, setHistory] = useState<T[]>([initialValue]);
  const [index, setIndex] = useState(0);

  const value = history[index];
  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const valueToSet =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(value)
          : newValue;

      setHistory((prev: T[]) => {
        const newHistory = prev.slice(0, index + 1);
        newHistory.push(valueToSet);
        return newHistory;
      });
      setIndex((prev: number) => prev + 1);
    },
    [index, value]
  );

  const undo = useCallback(() => {
    if (canUndo) {
      setIndex((prev: number) => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setIndex((prev: number) => prev + 1);
    }
  }, [canRedo]);

  const reset = useCallback(() => {
    setHistory([initialValue]);
    setIndex(0);
  }, [initialValue]);

  return {
    value,
    setValue,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}

/**
 * Hook that provides state with validation
 * @param initialValue - Initial state value
 * @param validator - Validation function
 * @returns State object with value, setValue, error, isValid
 * @example
 * const state = useValidatedState('', (val) => val.length > 0 ? null : 'Required')
 */
export function useValidatedState<T>(
  initialValue: T,
  validator: (value: T) => string | null
) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const valueToSet =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(value)
          : newValue;

      setValue(valueToSet);
      const validationError = validator(valueToSet);
      setError(validationError);
    },
    [value, validator]
  );

  const isValid = error === null;

  return {
    value,
    setValue: updateValue,
    error,
    isValid,
    validate: () => {
      const validationError = validator(value);
      setError(validationError);
      return validationError === null;
    },
  };
}

/**
 * Hook that provides state with comparison
 * @param initialValue - Initial state value
 * @param compareFn - Comparison function
 * @returns State object with value, setValue, hasChanged
 * @example
 * const state = useComparedState(0, (a, b) => a === b)
 */
export function useComparedState<T>(
  initialValue: T,
  compareFn: (a: T, b: T) => boolean = (a, b) => a === b
) {
  const [value, setValue] = useState<T>(initialValue);
  const initialRef = useRef<T>(initialValue);

  const hasChanged = !compareFn(value, initialRef.current);

  const reset = useCallback(() => {
    setValue(initialRef.current);
  }, []);

  return {
    value,
    setValue,
    hasChanged,
    reset,
  };
}

/**
 * Hook that provides state with getter/setter and equality check
 * @param initialValue - Initial state value
 * @param equals - Equality function
 * @returns [value, setValue] tuple
 * @example
 * const [value, setValue] = useEqualityState(obj, (a, b) => a.id === b.id)
 */
export function useEqualityState<T>(
  initialValue: T,
  equals: (a: T, b: T) => boolean = (a, b) => a === b
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next =
          typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
        return equals(prev, next) ? prev : next;
      });
    },
    [equals]
  );

  return [state, setValue];
}

/**
 * Hook that provides state array with array methods
 * @param initialValue - Initial array value
 * @returns Array state object with methods
 * @example
 * const array = useArrayState([1, 2, 3])
 * array.push(4)
 * array.remove(2)
 */
export function useArrayState<T>(initialValue: T[] = []) {
  const [array, setArray] = useState<T[]>(initialValue);

  const push = useCallback((item: T) => {
    setArray((prev: T[]) => [...prev, item]);
  }, []);

  const remove = useCallback((index: number) => {
    setArray((prev: T[]) => prev.filter((_: T, i: number) => i !== index));
  }, []);

  const removeByValue = useCallback((item: T) => {
    setArray((prev: T[]) => prev.filter((i: T) => i !== item));
  }, []);

  const update = useCallback((index: number, item: T) => {
    setArray((prev: T[]) => {
      const newArray = [...prev];
      newArray[index] = item;
      return newArray;
    });
  }, []);

  const insert = useCallback((index: number, item: T) => {
    setArray((prev: T[]) => {
      const newArray = [...prev];
      newArray.splice(index, 0, item);
      return newArray;
    });
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const reset = useCallback(() => {
    setArray(initialValue);
  }, [initialValue]);

  return {
    value: array,
    setValue: setArray,
    push,
    remove,
    removeByValue,
    update,
    insert,
    clear,
    reset,
    length: array.length,
  };
}

/**
 * Hook that provides state object with object methods
 * @param initialValue - Initial object value
 * @returns Object state object with methods
 * @example
 * const obj = useObjectState({ name: 'John' })
 * obj.set('age', 30)
 * obj.remove('name')
 */
export function useObjectState<T extends Record<string, any>>(
  initialValue: T = {} as T
) {
  const [object, setObject] = useState<T>(initialValue);

  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setObject((prev: T) => ({ ...prev, [key]: value }));
  }, []);

  const remove = useCallback((key: keyof T) => {
    setObject((prev: T) => {
      const { [key]: _, ...rest } = prev;
      return rest as T;
    });
  }, []);

  const update = useCallback((updates: Partial<T>) => {
    setObject((prev: T) => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setObject(initialValue);
  }, [initialValue]);

  const clear = useCallback(() => {
    setObject({} as T);
  }, []);

  return {
    value: object,
    setValue: setObject,
    set,
    remove,
    update,
    reset,
    clear,
  };
}

/**
 * Hook that provides state with loading and error states
 * @param initialValue - Initial state value
 * @returns State object with value, setValue, loading, error, setLoading, setError
 * @example
 * const state = useAsyncState(null)
 * state.setLoading(true)
 * state.setValue(data)
 */
export function useAsyncState<T>(initialValue: T | null = null) {
  const [value, setValue] = useState<T | null>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setValue(initialValue);
    setLoading(false);
    setError(null);
  }, [initialValue]);

  return {
    value,
    setValue,
    loading,
    setLoading,
    error,
    setError,
    reset,
  };
}
