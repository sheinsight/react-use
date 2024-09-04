# 🚥 Ref Getter {#ref-getter}

Ref Getter is a function specially designed to access the current value of a React Ref.

## TL; DR {#tl-dr}

- In React development, careless handling can easily lead to stale closure issues.
- When the value of a Ref created by `useRef` is changed, it does not trigger a re-render of the component.
- By using a Ref Getter, you can easily access the latest value of a Ref without triggering a re-render of the component.
- Ref Getter effectively avoids issues related to stale closures and simplifies the reading of Ref values.
- It is very useful in scenarios where Ref is frequently accessed, such as in custom Hooks or complex component logic.

## Motivation {#motivation}

In React, "effectively managing the access and update of values without triggering a re-render of the component" is crucial for performance optimization. The concept of the Ref Getter was developed to solve this problem.

A Ref Getter is a function specially designed to access the current value of a React Ref, bypassing the behavior of directly reading `ref.current`. This tool is particularly important in scenarios such as custom Hooks or complex component logic, where the value of a Ref is frequently needed. **It ensures that you always obtain the latest value of a Ref, effectively avoiding issues with stale closures**.

It's important to note that **components will not re-render when the Ref value changes**, so please do not use the Ref Getter for UI rendering. If you need to trigger re-renders based on changes, it's recommended to use `useState` or `useReducer`.

:::tip Tip

Choosing to use Ref and its Getter is fundamentally a performance trade-off, allowing developers to effectively manage state while avoiding unnecessary re-renders. However, it is critical to use this pattern cautiously, as overuse or misuse can lead to complexity or unintended behaviors in React applications.

This delicate balance ensures that your application retains its performance while still being able to respond to dynamic demands without sacrificing React's principles of reactivity.

:::

## useGetterRef {#use-getter-ref}

`useGetterRef` is a custom Hook aimed at simplifying the creation of a Ref Getter function and the corresponding Ref object. This setup allows you to easily obtain the current value of a Ref through the Ref Getter function while being able to directly update the Ref.

```tsx
const [isActive, isActiveRef] = useGetterRef(false)

// Accessing the current value of the Ref
console.log(isActive()) // Output: false

// Updating the Ref value
isActiveRef.current = true

console.log(isActive) // Output: true
```

## Ref (or Value) Getter in This Library {#ref-getter-in-this-library}

### `isActive` {#is-active}

This is a Ref Getter created by `usePausable`, see [Pausable](/docs/features/pausable) for more details.

### `isMounted` {#is-mounted}

This is a Ref Getter created by `useMounted`, see [useMounted](/reference/use-mounted) for more details.

### `isUnmounted` {#is-unmounted}

This is a Ref Getter created by `useUnmounted`, see [useUnmounted](/reference/use-unmounted) for more details.

... More content is coming soon!
