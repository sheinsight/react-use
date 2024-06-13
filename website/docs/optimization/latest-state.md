---
sidebar_position: 3
---

# Latest State

## Overview

To address common issues associated with closures capturing stale state or props, `@shined/use` automatically manages the latest state within its hooks. This internal mechanism ensures that state updates or effect dependencies always reference the most current data, safeguarding against bugs that typically arise from asynchronous operations relying on outdated state.

## Practical Implications

This feature is particularly vital in scenarios involving delayed responses, such as in network requests or timeouts, where the state might change in the interim. By consistently providing the latest value, developers can avoid the complexity and potential errors of manually managing closures to capture updated state.

## Hooks States in `@shined/use`

`@shined/use` ensures that any stale data issues are internally managed, allowing developers to focus on broader application logic rather than the nuances of state management within asynchronous callbacks. ∑

## Ensure Latest State in Your Codebase

States in `@shined/use` is always the latest, but if you need to ensure the latest state in your codebase, you can use the following hooks:

### use `useLatest` Hook

```tsx
import { useLatest } from '@shined/use'

function App() {
  const latest = useLatest(value)

  useMount(() => {
    setTimeout(() => {
      // `latest.current` always references the latest value of `value`
      console.log(latest.current)
    }, 1000)
  })
}
```

### use `useSignalState` Hook

```tsx
import { useSignalState } from '@shined/use'

function App() {
  const [state, setState] = useSignalState(initialState)

  useMount(() => {
    setTimeout(() => {
      // `state()` always references the latest value of the state
      console.log(state())
    }, 1000)
  })
}
```
