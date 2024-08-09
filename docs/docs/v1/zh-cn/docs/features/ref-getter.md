---
sidebar_position: 3
---

# Ref 获取函数 Ref Getter {#ref-getter}

Ref Getter 是一个专门设计用来访问 React ref 当前值的函数。

## 简而言之 {#tl-dr}

- 它能有效避免与陈旧闭包相关的问题，并简化 ref 值的读取。
- 在频繁读取 ref 的场景下非常有用，例如自定义 Hooks 或复杂组件逻辑。
- 使用 Ref Getter 修改 ref 的值时不会触发组件的重新渲染。
- 如果需要基于变化触发重新渲染，可考虑使用 `useState` 或 `useReducer`。

## 动机 {#motivation}

在 React 中，高效地管理值的访问和更新而不触发组件重新渲染对性能优化至关重要。这就是 **Ref Getter** 发挥作用的地方。

Ref Getter 是一个专门设计用来访问 React ref 当前值的函数，从而绕过了直接操作 `ref.current` 的需求。这一工具在如自定义 Hooks 或复杂组件逻辑等场景中显得尤为重要，这些场合下频繁需要使用 ref 的值。它确保了能够获取 ref 最新的值，有效避免了与陈旧闭包相关的问题。

值得注意的是，这样使用 ref **不会**在 ref 值改变时触发重新渲染。如果需要基于变化触发重新渲染，建议使用 `useState` 或 `useReducer`。

:::tip

选择使用 ref 及其获取器从根本上是一种性能权衡，允许开发者在有效管理状态的同时避免不必要的重新渲染。然而，至关重要的是要谨慎使用这种模式，因为过度使用或不当使用可能导致 React 应用中的代码复杂或产生意外行为。

这种微妙的平衡确保了您的应用在保持性能的同时，还能响应动态需求，不牺牲 React 的响应性原则。

:::

## `useGetterRef`

`useGetterRef` 是一个自定义 Hook，旨在简化 Ref Getter 函数及对应 ref 对象的创建。这种设置让你可以通过 Ref Getter 函数轻松获取 ref 的当前值，同时还能直接更新 ref。

```tsx
const [isActive, isActiveRef] = useGetterRef(false)

// 访问 ref 的当前值
console.log(isActive()) // 输出：false

// 更新 ref 值
isActiveRef.current = true

console.log(isActive) // 输出：true
```

## 本库中的 Ref (或 value) Getter {#ref-getter-in-this-library}

### `isActive` {#is-active}

这是由 `usePausable` 创建的一个 Ref Getter，详见 [Pausable](/docs/features/pausable) 获取更多详情。

### `isMounted` {#is-mounted}

这是由 `useMounted` 创建的一个 Ref Getter，详见 [useMounted](/reference/use-mounted) 获取更多详情。

### `isUnmounted` {#is-unmounted}

这是由 `useUnmounted` 创建的一个 Ref Getter，详见 [useUnmounted](/reference/use-unmounted) 获取更多详情。

### `isCancelled` {#is-cancelled}

这是在 `useAsyncEffect` 回调中的一个 value getter 参数，详见 [useAsyncEffect](/reference/use-async-effect) 获取更多详情。

... 更多内容即将到来！
