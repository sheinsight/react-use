# Pausable {#pausable}

Using Hooks like `useIntervalFn` and `useMouse` makes managing different features easier and more dynamic. However, adding a way to pause and resume these Hooks could make them even more useful. This feature would give us more control and help avoid unnecessary updates, making the user experience better.

With this in mind, we introduce `Pausable` instance.

## `Pausable` Instance {#pausable-instance}

The `Pausable` is designed to encapsulate the ability to pause and resume functionality, along with providing access to the current active state, without directly triggering a component re-render. This approach maintains the original expected behavior while offering additional control.

A `Pausable` instance is defined as follows:

```tsx
export type Pausable<PauseArgs extends unknown[] = [], ResumeArgs extends unknown[] = []> = {
  /**
   * Whether the instance is active, it just a Ref Getter
   */
  isActive(): boolean
  /**
   * Pause the instances
   *
   * @params update - Whether to trigger a re-render
   */
  pause: (...args: [update?: boolean, ...PauseArgs]) => void
  /**
   * Resume the instance
   *
   * @params update - Whether to trigger a re-render
   */
  resume: (...args: [update?: boolean, ...ResumeArgs]) => void
}
```

## Introducing `usePausable` {#introducing-use-pausable}

The `usePausable` Hook helps to create pausable instances. It use `useGetterRef` under the hood to provide a getter for the `isActive` property.

```tsx
const pausable = usePausable(initialIsActive, pauseCallback, resumeCallback)
```

In many internal Hooks, `usePausable` is used to create a `Pausable` instance, which can then be used to pause and resume the functionality as needed.
