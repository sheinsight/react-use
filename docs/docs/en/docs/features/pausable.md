# ⏸️ Pausable

Utilizing hooks such as `useIntervalFn` and `useMouse` makes managing different functionalities simpler and more dynamic.

However, given the relatively high trigger frequency of these hooks, they might lead to unexpected performance costs. Hence, introducing a way to pause and resume these hooks provides developers with more control to avoid unnecessary updates, thus enhancing user experience.

Based on these considerations, we introduce the `Pausable` instance.

## Pausable Instance \{#pausable-instance}

`Pausable` aims to encapsulate the abilities to pause and resume functionalities and provides access to the current active status without directly triggering component re-renders. This method maintains the originally intended behavior while offering additional control.

A `Pausable` instance is defined as follows:

```tsx
export type Pausable<PauseArgs extends unknown[] = [], ResumeArgs extends unknown[] = []> = {
  /**
   * Whether the instance is active, it's just a Ref Getter
   */
  isActive(): boolean
  /**
   * Pause the instance
   *
   * @params update - Whether to trigger re-render
   */
  pause: (...args: [update?: boolean, ...PauseArgs]) => void
  /**
   * Resume the instance
   *
   * @params update - Whether to trigger re-render
   */
  resume: (...args: [update?: boolean, ...ResumeArgs]) => void
}
```

## Introducing usePausable \{#introducing-use-pausable}

The `usePausable` hook helps create a pausable instance. It utilizes `useGetterRef` underneath to provide a getter for the `isActive` property.

```tsx
const pausable = usePausable(initialIsActive, pauseCallback, resumeCallback)
```

In many internal hooks, `usePausable` is used to create a `Pausable` instance, and then different hooks can customize the logic of pausing and resuming according to their own needs.

## Example Usage \{#example-usage}

Below is a simple example showing how to use a `Pausable` instance:

```tsx
import { usePausable } from '@shined/react-use'

function App() {
  // pausable can be obtained from the return of some hooks
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
