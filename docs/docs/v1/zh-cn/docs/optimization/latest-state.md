---
sidebar_position: 3
---

# 最新状态 Latest State {#latest-state}

## 概览 {#overview}

为了解决闭包捕获陈旧状态或属性的常见问题，`@shined/react-use` 自动管理其钩子中的最新状态。这一内部机制确保状态更新或 Effect 依赖总是引用最新的数据，避免了因异步操作依赖过时状态而通常出现的错误。

## 实际意义 {#practical-implications}

在涉及延迟响应的场景中，这一特性尤其重要，例如在网络请求或超时中，状态可能在此期间发生变化。通过始终提供最新值，开发者可以避免手动管理闭包以捕获更新状态的复杂性和潜在错误。

## `@shined/react-use` 中的 Hooks 状态 {#hooks-states-in-shined-react-use}

`@shined/react-use` 确保任何陈旧数据问题都在内部得到管理，允许开发者专注于更广泛的应用逻辑，而不是异步回调中状态管理的细节。∑

## 在您的代码库中确保最新状态 {#ensure-latest-state-in-your-codebase}

在 `@shined/react-use` 中，状态总是最新的，但如果您需要确保代码库中的最新状态，您可以使用以下 Hooks：

### 使用 `useLatest` Hook {#use-latest-hook}

```tsx
import { useLatest } from '@shined/react-use'

function App() {
  const latest = useLatest(value)

  useMount(() => {
    setTimeout(() => {
      // `latest.current` 总是引用 `value` 的最新值
      console.log(latest.current)
    }, 1000)
  })
}
```

### 使用 `useSignalState` Hook {#use-signal-state-hook}

```tsx
import { useSignalState } from '@shined/react-use'

function App() {
  const [state, setState] = useSignalState(initialState)

  useMount(() => {
    setTimeout(() => {
      // `state()` 总是引用状态的最新值
      console.log(state())
    }, 1000)
  })
}
```
