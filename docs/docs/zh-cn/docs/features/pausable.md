# ⏸️ 可暂停（Pausable） {#pausable}

使用像 `useIntervalFn` 和 `useMouse` 之类 Hook 使得管理不同的功能变得更加简单和动态。

然而，由于这些 Hook 的触发频率相对较高，可能导致意外的性能开销，因此增加一种暂停和恢复这些 Hook 的方式可以带给开发者更多的控制权，以避免不必要的更新，从而改善用户体验。

基于这样的考虑，我们引入了 `Pausable` 实例。

## Pausable 实例 {#pausable-instance}

`Pausable` 旨在封装暂停和恢复功能的能力，并提供对当前活动状态的访问，而不直接触发组件重渲染。这种方法保持了原始预期的行为，同时提供了额外的控制。

一个 `Pausable` 实例定义如下：

```tsx
export type Pausable<PauseArgs extends unknown[] = [], ResumeArgs extends unknown[] = []> = {
  /**
   * 实例是否处于活跃状态，它只是一个 Ref Getter
   */
  isActive(): boolean
  /**
   * 暂停实例
   *
   * @params update - 是否触发重渲染
   */
  pause: (...args: [update?: boolean, ...PauseArgs]) => void
  /**
   * 恢复实例
   *
   * @params update - 是否触发重渲染
   */
  resume: (...args: [update?: boolean, ...ResumeArgs]) => void
}
```

## usePausable {#introducing-use-pausable}

`usePausable` Hook 帮助创建可暂停的实例。它在底层使用 `useGetterRef` 来提供 `isActive` 属性的 getter。

```tsx
const pausable = usePausable(initialIsActive, pauseCallback, resumeCallback)
```

在许多内部 Hook 中，`usePausable` 被用来创建一个 `Pausable` 实例，然后不同的 Hooks 可以根据自身需求，自定义暂停和恢复的功能逻辑。

## 示例使用 {#example-usage}

下面是一个简单的示例，展示了如何使用 `Pausable` 实例：

```tsx
import { usePausable } from '@shined/react-use'

function App() {
  // pausable 可以从某些 Hooks 的返回里拿到
  // const { isActive, pause, resume, ...others } = useMouse()

  const { isActive, pause, resume } = usePausable(false)

  function check() {
    if (isActive()) {
      // Do something
    }
  }

  return (
    <div>
      <button onClick={() => pausable.pause()}>Pause</button>
      <button onClick={() => pausable.resume()}>Resume</button>
      <button onClick={check}>Check</button>
    </div>
  )
}
```
