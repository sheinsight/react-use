# 🪄 Latest State {#latest-state}

## Overview {#overview}

To address common issues associated with closures capturing stale state or props, `@shined/react-use` automatically manages the latest state within its Hooks. This internal mechanism ensures that state updates or effect dependencies always reference the most current data, safeguarding against bugs that typically arise from asynchronous operations relying on outdated state.

## Practical Implications {#practical-implications}

This feature is particularly vital in scenarios involving delayed responses, such as in network requests or timeouts, where the state might change in the interim. By consistently providing the latest value, developers can avoid the complexity and potential errors of manually managing closures to capture updated state.

## Hooks States in `@shined/react-use` {#hooks-states-in-shined-react-use}

`@shined/react-use` ensures that any stale data issues are internally managed, allowing developers to focus on broader application logic rather than the nuances of state management within asynchronous callbacks. ∑

## Ensure Latest State in Your Codebase {#ensure-latest-state-in-your-codebase}

States in `@shined/react-use` is always the latest, but if you need to ensure the latest state in your codebase, you can use the following Hooks:

### use `useLatest` Hook {#use-latest-hook}

```tsx
import { useLatest } from '@shined/react-use'

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

### use `useSignalState` Hook {#use-signal-state-hook}

```tsx
import { useSignalState } from '@shined/react-use'

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
