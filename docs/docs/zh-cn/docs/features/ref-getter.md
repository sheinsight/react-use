# 🚥 Ref 获取函数（Ref Getter） {#ref-getter}

Ref Getter 是一个专门设计用来访问 React Ref 当前值的函数。

## 简而言之 {#tl-dr}

- 在 React 开发中，如果不加注意，容易出现过期闭包问题。
- `useRef` 创建的 Ref 值被修改时，不会触发组件的重新渲染。
- 通过 Ref Getter，可以轻松访问 Ref 的最新值且不会触发组件重新渲染。
- Ref Getter 有效避免了过期闭包相关的问题，并简化了 Ref 值的读取。
- 在频繁读取 Ref 的场景下非常有用，例如自定义 Hooks 或复杂组件逻辑。

## 动机 {#motivation}

在 React 中，「高效地管理值的访问和更新而不触发组件重新渲染」对于性能优化来说至关重要，Ref Getter 的概念就是为了解决这个问题。

Ref Getter 是一个专门设计用来访问 React Ref 当前值的函数，绕过了直接读取 `ref.current` 的行为。这一工具在自定义 Hooks 或复杂组件逻辑等场景中显得尤为重要，这些场合下频繁需要使用 Ref 的值，同时**它能够确保始终获取 Ref 最新的值，有效避免了与过期闭包相关的问题**。

值得注意的是，**组件不会在 Ref 值改变时触发重新渲染**，所以请不要将 Ref Getter 用于 UI 渲染。如果需要基于变化触发重新渲染，建议使用 `useState` 或 `useReducer`。

:::tip 提示
选择使用 Ref 及其 Getter 从根本上是一种性能权衡，允许开发者在有效管理状态的同时避免不必要的重新渲染。然而，至关重要的是要谨慎使用这种模式，因为过度使用或不当使用可能导致 React 应用中的代码复杂或产生意外行为。

这种微妙的平衡确保了您的应用在保持性能的同时，还能响应动态需求，不牺牲 React 的响应性原则。
:::

## useGetterRef \{#use-getter-ref}

`useGetterRef` 是一个自定义 Hook，旨在简化 Ref Getter 函数及对应 Ref 对象的创建。这种设置让你可以通过 Ref Getter 函数轻松获取 Ref 的当前值，同时还能直接更新 Ref。

```tsx
const [isActive, isActiveRef] = useGetterRef(false)

// 访问 Ref 的当前值
console.log(isActive()) // 输出：false

// 更新 Ref 值
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

... 更多内容即将到来！
