/**
 * React Effects Utilities
 * Utilities for working with React effects
 */

import { useEffect, useRef, DependencyList } from "react";

/**
 * Hook that runs effect only on mount
 * @param effect - Effect function
 * @example
 * useMount(() => { console.log('mounted') })
 */
export function useMount(effect: () => void | (() => void)): void {
  useEffect(effect, []);
}

/**
 * Hook that runs effect only on unmount
 * @param effect - Cleanup function
 * @example
 * useUnmount(() => { console.log('unmounted') })
 */
export function useUnmount(effect: () => void): void {
  const effectRef = useRef(effect);
  effectRef.current = effect;

  useEffect(() => {
    return () => {
      effectRef.current();
    };
  }, []);
}

/**
 * Hook that runs effect only on update (not on mount)
 * @param effect - Effect function
 * @param deps - Dependency array
 * @example
 * useUpdate(() => { console.log('updated') }, [count])
 */
export function useUpdate(
  effect: () => void | (() => void),
  deps: DependencyList
): void {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    return effect();
  }, deps);
}

/**
 * Hook that runs effect with deep comparison
 * @param effect - Effect function
 * @param deps - Dependency array
 * @example
 * useDeepEffect(() => { console.log('deep changed') }, [obj])
 */
export function useDeepEffect(
  effect: () => void | (() => void),
  deps: DependencyList
): void {
  const depsRef = useRef<DependencyList>();
  const signalRef = useRef(0);

  if (
    !depsRef.current ||
    !deps.every((dep: any, i: number) => deepEqual(dep, depsRef.current![i]))
  ) {
    depsRef.current = deps;
    signalRef.current += 1;
  }

  useEffect(effect, [signalRef.current]);
}

/**
 * Hook that runs effect only once per value change
 * @param effect - Effect function
 * @param value - Value to track
 * @example
 * useOncePerValue(() => { console.log('value changed') }, userId)
 */
export function useOncePerValue<T>(
  effect: () => void | (() => void),
  value: T
): void {
  const valueRef = useRef<T>(value);
  const cleanupRef = useRef<void | (() => void)>();

  useEffect(() => {
    if (valueRef.current !== value) {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      valueRef.current = value;
      cleanupRef.current = effect();
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [value, effect]);
}

/**
 * Hook that runs effect with debounce
 * @param effect - Effect function
 * @param deps - Dependency array
 * @param delay - Debounce delay in milliseconds
 * @example
 * useDebouncedEffect(() => { console.log('debounced') }, [search], 300)
 */
export function useDebouncedEffect(
  effect: () => void | (() => void),
  deps: DependencyList,
  delay: number
): void {
  useEffect(() => {
    const handler = setTimeout(() => {
      return effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);
}

/**
 * Hook that runs effect with throttle
 * @param effect - Effect function
 * @param deps - Dependency array
 * @param limit - Throttle limit in milliseconds
 * @example
 * useThrottledEffect(() => { console.log('throttled') }, [scroll], 100)
 */
export function useThrottledEffect(
  effect: () => void | (() => void),
  deps: DependencyList,
  limit: number
): void {
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        effect();
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, limit]);
}

/**
 * Hook that runs effect only when condition is true
 * @param effect - Effect function
 * @param condition - Condition to check
 * @param deps - Dependency array
 * @example
 * useConditionalEffect(() => { console.log('condition met') }, isEnabled, [isEnabled])
 */
export function useConditionalEffect(
  effect: () => void | (() => void),
  condition: boolean,
  deps: DependencyList
): void {
  useEffect(() => {
    if (condition) {
      return effect();
    }
  }, [condition, ...deps]);
}

/**
 * Deep equality check helper
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}
