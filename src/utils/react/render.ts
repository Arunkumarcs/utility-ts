/**
 * React Render Utilities
 * Utilities for conditional rendering and component patterns
 */

import { ReactNode, isValidElement, cloneElement, Children } from "react";

/**
 * Renders component only if condition is true
 * @param condition - Condition to check
 * @param component - Component or element to render
 * @param fallback - Fallback component (optional)
 * @returns Component or null
 * @example
 * <If condition={isLoggedIn}>
 *   <Dashboard />
 * </If>
 */
export function If({
  condition,
  children,
  fallback = null,
}: {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}): ReactNode {
  return condition ? children : fallback;
}

/**
 * Renders component only when value is truthy
 * @param value - Value to check
 * @param children - Component or element to render
 * @param fallback - Fallback component (optional)
 * @returns Component or null
 * @example
 * <When value={user}>
 *   <UserProfile user={user} />
 * </When>
 */
export function When<T>({
  value,
  children,
  fallback = null,
}: {
  value: T | null | undefined;
  children: ReactNode | ((value: T) => ReactNode);
  fallback?: ReactNode;
}): ReactNode {
  if (!value) {
    return fallback;
  }

  if (typeof children === "function") {
    return children(value);
  }

  return children;
}

/**
 * Renders component only when value is null or undefined
 * @param value - Value to check
 * @param children - Component or element to render
 * @returns Component or null
 * @example
 * <WhenNull value={user}>
 *   <LoginForm />
 * </WhenNull>
 */
export function WhenNull<T>({
  value,
  children,
}: {
  value: T | null | undefined;
  children: ReactNode;
}): ReactNode {
  return value == null ? children : null;
}

/**
 * Renders component only when array is empty
 * @param array - Array to check
 * @param children - Component or element to render
 * @returns Component or null
 * @example
 * <WhenEmpty array={items}>
 *   <EmptyState />
 * </WhenEmpty>
 */
export function WhenEmpty<T>({
  array,
  children,
}: {
  array: T[] | null | undefined;
  children: ReactNode;
}): ReactNode {
  return array == null || array.length === 0 ? children : null;
}

/**
 * Renders component only when array has items
 * @param array - Array to check
 * @param children - Component or element to render
 * @param fallback - Fallback component (optional)
 * @returns Component or null
 * @example
 * <WhenNotEmpty array={items}>
 *   <ItemList items={items} />
 * </WhenNotEmpty>
 */
export function WhenNotEmpty<T>({
  array,
  children,
  fallback = null,
}: {
  array: T[] | null | undefined;
  children: ReactNode | ((array: T[]) => ReactNode);
  fallback?: ReactNode;
}): ReactNode {
  if (array == null || array.length === 0) {
    return fallback;
  }

  if (typeof children === "function") {
    return children(array);
  }

  return children;
}

/**
 * Switches rendering based on value
 * @param value - Value to switch on
 * @param cases - Cases object
 * @param defaultCase - Default case (optional)
 * @returns Component or null
 * @example
 * <Switch
 *   value={status}
 *   cases={{
 *     loading: <Spinner />,
 *     error: <Error />,
 *     success: <Success />
 *   }}
 *   defaultCase={<Default />}
 * />
 */
export function Switch<T extends string | number>({
  value,
  cases,
  defaultCase = null,
}: {
  value: T;
  cases: Record<T, ReactNode>;
  defaultCase?: ReactNode;
}): ReactNode {
  return cases[value] ?? defaultCase;
}

/**
 * Maps over children and clones with additional props
 * @param children - React children
 * @param props - Props to inject
 * @returns Cloned children with props
 * @example
 * <CloneChildren props={{ active: true }}>
 *   {children}
 * </CloneChildren>
 */
export function CloneChildren({
  children,
  props,
}: {
  children: ReactNode;
  props: Record<string, any>;
}): ReactNode {
  return Children.map(children, (child: ReactNode) => {
    if (isValidElement(child)) {
      return cloneElement(child, props);
    }
    return child;
  });
}

/**
 * Renders children only if all conditions are true
 * @param conditions - Array of conditions
 * @param children - Component or element to render
 * @param fallback - Fallback component (optional)
 * @returns Component or null
 * @example
 * <All conditions={[isLoggedIn, hasPermission]}>
 *   <ProtectedContent />
 * </All>
 */
export function All({
  conditions,
  children,
  fallback = null,
}: {
  conditions: boolean[];
  children: ReactNode;
  fallback?: ReactNode;
}): ReactNode {
  return conditions.every(Boolean) ? children : fallback;
}

/**
 * Renders children if any condition is true
 * @param conditions - Array of conditions
 * @param children - Component or element to render
 * @param fallback - Fallback component (optional)
 * @returns Component or null
 * @example
 * <Any conditions={[isAdmin, isModerator]}>
 *   <AdminPanel />
 * </Any>
 */
export function Any({
  conditions,
  children,
  fallback = null,
}: {
  conditions: boolean[];
  children: ReactNode;
  fallback?: ReactNode;
}): ReactNode {
  return conditions.some(Boolean) ? children : fallback;
}

/**
 * Renders children with loading state
 * @param loading - Loading state
 * @param children - Component or element to render
 * @param fallback - Loading fallback (optional)
 * @returns Component or loading fallback
 * @example
 * <Loading loading={isLoading} fallback={<Spinner />}>
 *   <Content />
 * </Loading>
 */
export function Loading({
  loading,
  children,
  fallback = null,
}: {
  loading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}): ReactNode {
  return loading ? fallback : children;
}

/**
 * Renders children with error state
 * @param error - Error object or null
 * @param children - Component or element to render
 * @param fallback - Error fallback (optional)
 * @returns Component or error fallback
 * @example
 * <ErrorBoundary error={error} fallback={<ErrorDisplay />}>
 *   <Content />
 * </ErrorBoundary>
 */
export function ErrorBoundary({
  error,
  children,
  fallback = null,
}: {
  error: Error | null | undefined;
  children: ReactNode;
  fallback?: ReactNode;
}): ReactNode {
  return error ? fallback : children;
}
