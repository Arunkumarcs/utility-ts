/**
 * React Refs Utilities
 * Utilities for working with React refs
 */

import { Ref, RefCallback, MutableRefObject } from "react";

/**
 * Merges multiple refs into a single ref callback
 * @param refs - Array of refs to merge
 * @returns Merged ref callback
 * @example
 * const mergedRef = mergeRefs([ref1, ref2, ref3])
 */
export function mergeRefs<T = any>(
  ...refs: Array<Ref<T> | undefined>
): RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}

/**
 * Creates a ref callback that can be used with forwardRef
 * @param callback - Callback function
 * @returns Ref callback
 * @example
 * const ref = useRefCallback((node) => { console.log(node) })
 */
export function useRefCallback<T>(
  callback: (value: T) => void
): RefCallback<T> {
  return (value: T) => {
    callback(value);
  };
}

/**
 * Gets the current value from a ref
 * @param ref - Ref object
 * @returns Current value or undefined
 * @example
 * const value = getRefValue(ref)
 */
export function getRefValue<T>(ref: Ref<T> | undefined): T | undefined {
  if (ref == null) {
    return undefined;
  }

  if (typeof ref === "function") {
    return undefined;
  }

  return (ref as MutableRefObject<T | null>).current ?? undefined;
}

/**
 * Sets the value of a ref
 * @param ref - Ref object
 * @param value - Value to set
 * @example
 * setRefValue(ref, newValue)
 */
export function setRefValue<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (ref == null) {
    return;
  }

  if (typeof ref === "function") {
    ref(value);
  } else {
    (ref as MutableRefObject<T | null>).current = value;
  }
}
