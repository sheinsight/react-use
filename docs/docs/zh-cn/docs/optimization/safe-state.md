# 🔒 安全状态（Safe State） {#safe-state}

## 概览 {#overview}

`@shined/react-use` 为组件内的所有状态管理操作实现了 [useSafeState](/reference/use-safe-state) 方法。这种方法确保状态更新是受控和安全的，特别是在涉及异步操作或可能的意外组件卸载场景中。它被设计为 `React.useState` 的替代方案。

本质上，`useSafeState` 的行为根据使用的 React 版本而有所不同：

- **React 17 及更早版本**：仅在组件仍然挂载时更新状态，这一行为通过 `useUnmounted` Hook 确保。这种方法有效地抑制了与在卸载的组件上设置状态相关的常见 React 警告。
- **React 18 及以后版本**：其功能与 `React.useState` 相同，利用了 React 的内部机制更优雅地处理卸载组件上的状态更新。

## 处理卸载组件上的 `setState` 调用 {#handling-set-state-calls-on-unmounted-components}

人们常有一个误解，认为在卸载的组件上调用 `setState` 会导致内存泄漏。这个警告主要是提醒开发者在组件卸载后终止任何正在进行的操作，如计时器和订阅。

此外，在组件的生命周期中，如果在组件卸载后调用了 `setState`，它将变成一个无操作（noop）。实际上，这意味着这样的调用会被无害地忽略；因此，它们不会导致内存泄漏或触发不希望的状态更新。

根据 React 18 的讨论，如 [讨论#82](https://github.com/reactwg/react-18/discussions/82)，对 React 的未来更新暗示了卸载组件上状态更新处理方式的潜在改变。它建议，避免在卸载的组件上更新状态可能比允许这种更新更有问题，指向了未来 React 版本的最佳实践可能的转变。

通过这种方式，`useSafeState` 确保了跨不同版本的 React 的兼容性和韧性状态管理，解决了当前和潜在的未来行为，关于卸载组件上的状态更新。