# 🔒 安全状态（Safe State） {#safe-state}

## 概览 {#overview}

`@shined/react-use` 为内部的所有状态（State）管理操作操作实现了 [useSafeState](/reference/use-safe-state) 方法。这种方法确保状态更新是受控和安全的，特别是在涉及异步操作或可能的意外组件卸载场景中。它被设计为 `React.useState` 的替代方案。

`useSafeState` 的行为根据使用的 React 版本而有所不同：

- **React 17 及更早版本**：仅在组件仍然挂载时更新状态，这一行为通过 [useUnmounted](/reference/use-unmounted) Hook 实现。这种方法有效地抑制了与「在卸载的组件上设置状态（State）」相关的常见 React 警告。
- **React 18 及以后版本**：其功能与 `React.useState` 相同，遵循 React 的内部机制，以更优雅地处理卸载组件上的状态更新。

## 处理卸载组件上的 `setState` 调用 {#handling-set-state-calls-on-unmounted-components}

开发者常有一个误解，认为在卸载的组件上调用 `setState` 会导致内存泄漏，但其实不然。

这个警告主要是提醒开发者在组件卸载后及时清理相关操作，比如计时器和订阅。在组件的生命周期中，如果在组件卸载后调用了 `setState`，它将变成一个空函数（`noop`）。实际上，这意味着这样的调用会被无害地忽略。因此，它们不会导致内存泄漏，或触发不希望的状态更新。

根据 React 18 的 [讨论#82](https://github.com/reactwg/react-18/discussions/82)，它指出了 React 未来更新和卸载组件上状态的更新处理方式可能发生潜在改变。官方表示，「避免在已卸载的组件上更新状态」可能比「允许这种更新」更有问题，这暗示了未来 React 版本状态更新的最佳实践可能发生转变。

## 现实意义 {#real-world-implications}

`@shined/react-use` 内部通过这种方式，使用 `useSafeState` 确保了跨不同版本的 React 的兼容性和韧性的状态管理，在规避了容易误解的警告的同时，也为未来 React 版本的变化做好了准备，确保了状态更新的安全性。
