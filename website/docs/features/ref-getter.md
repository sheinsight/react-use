---
sidebar_position: 3
---

# Ref Getter

A ref getter is a specialized function designed to access the current value of a React ref.

## TL; DR

- It can avoid issues related to stale closures effectively and simplify the reading of ref values.
- It is useful in scenarios where ref is read frequently, such as custom Hooks or complex component logic.
- Utilizing a ref getter does not trigger re-renders when the ref’s value is altered.
- To achieve a re-render based on changes, consider using `useState` or `useReducer`.

## Motivation

In React, managing efficiently the access and update of values without re-rendering components is crucial for performance optimization.This is where a **ref getter** comes into play.

A ref getter is a specialized function designed to access the current value of a React ref, thereby circumventing the need to directly engage with `ref.current`. This utility shines in scenarios such as custom Hooks or complex component logic, where the value of a ref is needed frequently. It guarantees the retrieval of the ref’s most current value, effectively avoiding issues related to stale closures.

It is important to note that utilizing a ref this way does **NOT** trigger re-renders when the ref’s value is altered. To achieve a re-render based on changes, employing `useState` or `useReducer` is advisable.

:::tip

Opting for a ref and its getter is fundamentally a performance trade-off, allowing developers to eschew unnecessary re-renders while effectively managing state. However, it's essential to utilize this pattern judiciously, as overuse or improper use may lead to complex code or unexpected behaviors in your React application.

This delicate balance ensures your application remains both performant and maintainable, catering to the dynamic needs without undermining React’s reactivity principles.

:::

## `useGetterRef`

`useGetterRef` is a custom Hook crafted to streamline the creation of a ref getter function alongside a ref object. This setup allows you to effortlessly fetch the current value of the ref via the ref getter function, while also granting the ability to update the ref directly.

```tsx
const [isActive, isActiveRef] = useGetterRef(false)

// Access the current value of the ref
console.log(isActive()) // Outputs: false

// Update the ref value
isActiveRef.current = true

console.log(isActive) // Outputs: true
```

## Ref Getters in This Library

### `isActive` {#is-active}

It is a ref getter created by `usePausable`, see [Pausable](/docs/features/pausable) for more details.

### `isCancelled` {#is-cancelled}

It is a ref getter params in `useAsyncEffect` callback, see [useAsyncEffect](/reference/use-async-effect) for more details.

### `isMounted` {#is-mounted}

It is a ref getter created by `useMounted`, see [useMounted](/reference/use-mounted) for more details.

### `isUnmounted` {#is-unmounted}

It is a ref getter created by `useUnmounted`, see [useUnmounted](/reference/use-unmounted) for more details.
