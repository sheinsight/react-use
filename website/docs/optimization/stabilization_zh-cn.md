---
sidebar_position: 2
---

# 稳定化 Stabilization {#stabilization}

## 概览 {#overview}

稳定化功能确保了函数引用在组件重渲染过程中保持不变，除非显式地被依赖变化所触发。这种稳定化对于优化 React 中的渲染行为至关重要，特别是当与像 `React.memo` 或 `shouldComponentUpdate` 这样的对性能敏感的模式集成时。

## useStableFn {#use-stable-fn}

我们通过 `@shined/react-use` 中的 [useStableFn](/reference/use-stable-fn) 钩子来实现稳定化，它通过记忆回调函数来防止不必要的重渲染。通过稳定函数，开发者可以避免性能瓶颈，并确保组件仅在必要时更新。

`@shined/react-use` 导出的每个函数都默认进行稳定化处理，确保它们不会因为依赖变化之外的原因导致不必要的重渲染。稳定回调函数最小化了导致其的风险，从而提升了性能和用户体验。

## 示例使用 {#example-usage}

```javascript
import { useStableFn } from '@shined/react-use'

function App() {
  const stableHandleClick = useStableFn(() => {
    // 做些什么
  })

  // `stableHandleClick` 在重渲染过程中是稳定的，除非依赖发生变化否则不会导致重渲染
  return <AwesomeComponent onClick={stableHandleClick} />
}
```

在这个示例中，`@shined/react-use` 的 `useStableFn` 被用来确保 `onClick` 函数不会导致重渲染。更多使用方式见 [useStableFn](/reference/use-stable-fn)。

这种方法不仅使组件更加高效，而且还防止了与重渲染周期相关的潜在错误。该 Hook 抽象了记忆函数所涉及的复杂性，使开发者能够直接实现。
