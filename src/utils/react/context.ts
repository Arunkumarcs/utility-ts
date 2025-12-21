/**
 * React Context Utilities
 * Utilities for working with React Context
 */

import {
  createContext,
  useContext,
  Context,
  ReactNode,
  useState,
  useReducer,
  useMemo,
  ComponentType,
  createElement,
} from "react";

/**
 * Creates a context with a custom hook that throws if used outside provider
 * @param name - Context name for error messages
 * @param defaultValue - Default context value
 * @returns Context object and use hook
 * @example
 * const [ThemeContext, useTheme] = createContextWithHook<Theme>('Theme', defaultTheme)
 */
export function createContextWithHook<T>(
  name: string,
  defaultValue?: T
): [Context<T | undefined>, () => T] {
  const Context = createContext<T | undefined>(defaultValue);

  const useHook = (): T => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    return context;
  };

  return [Context, useHook];
}

/**
 * Creates a context provider component factory
 * @param Context - React context
 * @param defaultValue - Default value
 * @returns Provider component
 * @example
 * const ThemeProvider = createProvider(ThemeContext, defaultTheme)
 */
export function createProvider<T>(
  Context: Context<T | undefined>,
  defaultValue?: T
): ComponentType<{ value?: T; children: ReactNode }> {
  return function Provider({
    value = defaultValue,
    children,
  }: {
    value?: T;
    children: ReactNode;
  }) {
    return createElement(Context.Provider, { value }, children);
  };
}

/**
 * Creates a context with state management
 * @param name - Context name
 * @param initialValue - Initial state value
 * @returns Context object, Provider component, and use hook
 * @example
 * const [CounterContext, CounterProvider, useCounter] = createStateContext('Counter', 0)
 */
export function createStateContext<T>(
  name: string,
  initialValue: T
): [
  Context<{
    value: T;
    setValue: (value: T | ((prev: T) => T)) => void;
  }>,
  ComponentType<{ value?: T; children: ReactNode }>,
  () => { value: T; setValue: (value: T | ((prev: T) => T)) => void }
] {
  const Context = createContext<
    | {
        value: T;
        setValue: (value: T | ((prev: T) => T)) => void;
      }
    | undefined
  >(undefined);

  function Provider({
    value: propValue,
    children,
  }: {
    value?: T;
    children: ReactNode;
  }) {
    const [value, setValue] = useState<T>(propValue ?? initialValue);

    const contextValue = useMemo(
      () => ({
        value,
        setValue,
      }),
      [value]
    );

    return createElement(Context.Provider, { value: contextValue }, children);
  }

  function useHook() {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    return context;
  }

  return [
    Context as Context<{
      value: T;
      setValue: (value: T | ((prev: T) => T)) => void;
    }>,
    Provider,
    useHook as () => {
      value: T;
      setValue: (value: T | ((prev: T) => T)) => void;
    },
  ];
}

/**
 * Creates a context with reducer pattern
 * @param name - Context name
 * @param reducer - Reducer function
 * @param initialState - Initial state
 * @returns Context object, Provider component, and use hook
 * @example
 * const [CounterContext, CounterProvider, useCounter] = createReducerContext(
 *   'Counter',
 *   (state, action) => action.type === 'increment' ? state + 1 : state,
 *   0
 * )
 */
export function createReducerContext<TState, TAction>(
  name: string,
  reducer: (state: TState, action: TAction) => TState,
  initialState: TState
): [
  Context<{
    state: TState;
    dispatch: (action: TAction) => void;
  }>,
  ComponentType<{ initialState?: TState; children: ReactNode }>,
  () => { state: TState; dispatch: (action: TAction) => void }
] {
  const Context = createContext<
    | {
        state: TState;
        dispatch: (action: TAction) => void;
      }
    | undefined
  >(undefined);

  function Provider({
    initialState: propInitialState,
    children,
  }: {
    initialState?: TState;
    children: ReactNode;
  }) {
    const [state, dispatch] = useReducer(
      reducer,
      propInitialState ?? initialState
    );

    const contextValue = useMemo(
      () => ({
        state,
        dispatch: dispatch as (action: TAction) => void,
      }),
      [state, dispatch]
    );

    return createElement(Context.Provider, { value: contextValue }, children);
  }

  function useHook() {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    return context;
  }

  return [
    Context as Context<{ state: TState; dispatch: (action: TAction) => void }>,
    Provider,
    useHook,
  ];
}

/**
 * Composes multiple context providers
 * @param providers - Array of provider components
 * @returns Composed provider component
 * @example
 * const AppProvider = composeProviders([ThemeProvider, AuthProvider, DataProvider])
 */
export function composeProviders(
  providers: ComponentType<{ children: ReactNode }>[]
): ComponentType<{ children: ReactNode }> {
  return function ComposedProvider({ children }: { children: ReactNode }) {
    return providers.reduceRight(
      (acc, Provider) => createElement(Provider, { children: acc }),
      children
    );
  };
}

/**
 * Creates a context selector hook
 * @param Context - React context
 * @param selector - Selector function
 * @returns Selected value
 * @example
 * const userName = useContextSelector(UserContext, (user) => user.name)
 */
export function useContextSelector<T, TSelected>(
  Context: Context<T | undefined>,
  selector: (value: T) => TSelected
): TSelected | undefined {
  const context = useContext(Context);
  if (context === undefined) {
    return undefined;
  }
  return selector(context);
}

/**
 * Creates a context with optional value
 * @param Context - React context
 * @returns Context value or undefined
 * @example
 * const theme = useOptionalContext(ThemeContext)
 */
export function useOptionalContext<T>(
  Context: Context<T | undefined>
): T | undefined {
  return useContext(Context);
}

/**
 * Creates a context factory with custom hook
 * @param factory - Factory function that returns context value
 * @param name - Context name
 * @returns Context object, Provider component, and use hook
 * @example
 * const [ApiContext, ApiProvider, useApi] = createContextFactory(
 *   () => ({ fetch: () => {} }),
 *   'Api'
 * )
 */
export function createContextFactory<T>(
  factory: () => T,
  name: string
): [Context<T | undefined>, ComponentType<{ children: ReactNode }>, () => T] {
  const Context = createContext<T | undefined>(undefined);

  function Provider({ children }: { children: ReactNode }) {
    const value = useMemo(() => factory(), []);
    return createElement(Context.Provider, { value }, children);
  }

  function useHook(): T {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    return context;
  }

  return [Context, Provider, useHook];
}

/**
 * Creates a context with actions pattern
 * @param name - Context name
 * @param initialState - Initial state
 * @param actions - Actions object
 * @returns Context object, Provider component, and use hook
 * @example
 * const [CounterContext, CounterProvider, useCounter] = createActionsContext(
 *   'Counter',
 *   0,
 *   {
 *     increment: (state) => state + 1,
 *     decrement: (state) => state - 1,
 *   }
 * )
 */
export function createActionsContext<
  TState,
  TActions extends Record<string, (state: TState, ...args: any[]) => TState>
>(
  name: string,
  initialState: TState,
  actions: TActions
): [
  Context<{
    state: TState;
    actions: {
      [K in keyof TActions]: (
        ...args: Parameters<TActions[K]> extends [TState, ...infer Rest]
          ? Rest
          : []
      ) => void;
    };
  }>,
  ComponentType<{ initialState?: TState; children: ReactNode }>,
  () => {
    state: TState;
    actions: {
      [K in keyof TActions]: (
        ...args: Parameters<TActions[K]> extends [TState, ...infer Rest]
          ? Rest
          : []
      ) => void;
    };
  }
] {
  const Context = createContext<
    | {
        state: TState;
        actions: {
          [K in keyof TActions]: (
            ...args: Parameters<TActions[K]> extends [TState, ...infer Rest]
              ? Rest
              : []
          ) => void;
        };
      }
    | undefined
  >(undefined);

  function Provider({
    initialState: propInitialState,
    children,
  }: {
    initialState?: TState;
    children: ReactNode;
  }) {
    const [state, setState] = useState<TState>(
      propInitialState ?? initialState
    );

    const contextActions = useMemo(() => {
      const result: any = {};
      for (const [key, action] of Object.entries(actions)) {
        result[key] = (...args: any[]) => {
          setState((prev) => action(prev, ...args));
        };
      }
      return result;
    }, []);

    const contextValue = useMemo(
      () => ({
        state,
        actions: contextActions,
      }),
      [state, contextActions]
    );

    return createElement(Context.Provider, { value: contextValue }, children);
  }

  function useHook() {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    return context;
  }

  type ContextValue = {
    state: TState;
    actions: {
      [K in keyof TActions]: (
        ...args: Parameters<TActions[K]> extends [TState, ...infer Rest]
          ? Rest
          : []
      ) => void;
    };
  };

  return [
    Context as Context<ContextValue>,
    Provider,
    useHook as () => ContextValue,
  ];
}

/**
 * Hook that provides context value with fallback
 * @param Context - React context
 * @param fallback - Fallback value
 * @returns Context value or fallback
 * @example
 * const theme = useContextWithFallback(ThemeContext, defaultTheme)
 */
export function useContextWithFallback<T>(
  Context: Context<T | undefined>,
  fallback: T
): T {
  const context = useContext(Context);
  return context ?? fallback;
}

/**
 * Creates a split context (separate read/write contexts)
 * @param name - Context name
 * @param initialValue - Initial value
 * @returns Read context, Write context, Provider component, and hooks
 * @example
 * const [ReadContext, WriteContext, Provider, useRead, useWrite] = createSplitContext('Counter', 0)
 */
export function createSplitContext<T>(
  name: string,
  initialValue: T
): [
  Context<T>,
  Context<(value: T | ((prev: T) => T)) => void>,
  ComponentType<{ value?: T; children: ReactNode }>,
  () => T,
  () => (value: T | ((prev: T) => T)) => void
] {
  const ReadContext = createContext<T>(initialValue);
  const WriteContext = createContext<(value: T | ((prev: T) => T)) => void>(
    () => {}
  );

  function Provider({
    value: propValue,
    children,
  }: {
    value?: T;
    children: ReactNode;
  }) {
    const [value, setValue] = useState<T>(propValue ?? initialValue);

    return createElement(
      ReadContext.Provider,
      { value },
      createElement(WriteContext.Provider, { value: setValue }, children)
    );
  }

  function useRead(): T {
    return useContext(ReadContext);
  }

  function useWrite(): (value: T | ((prev: T) => T)) => void {
    return useContext(WriteContext);
  }

  return [ReadContext, WriteContext, Provider, useRead, useWrite];
}
