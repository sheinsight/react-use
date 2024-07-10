---
sidebar_position: 2
---

# Stabilization {#stabilization}

## Overview {#overview}

The Stabilization feature ensures that function references remain constant across component re-renders unless explicitly triggered by dependency changes. This stability is crucial for optimizing rendering behavior in React, particularly when integrating with performance-sensitive patterns like `React.memo` or `shouldComponentUpdate`.

## useStableFn {#use-stable-fn}

We implement stabilization in `@shined/react-use` through the [useStableFn](/reference/use-stable-fn) Hook, which memoizes callback functions to prevent unnecessary re-renders. By stabilizing functions, developers can avoid performance bottlenecks and ensure that components only update when necessary.

Every functions exported from `@shined/react-use` are stabilized by default, ensuring that they do not cause unnecessary re-renders unless their dependencies change. Stabilizing callback functions minimizes the risk of it, leading to improved performance and user experience.

## Example Usage {#example-usage}

```javascript
import { useStableFn } from '@shined/react-use'

function App() {
  const stableHandleClick = useStableFn(() => {
    // do something
  })

  // `stableHandleClick` is stable across re-renders, will not cause re-renders unless dependencies change
  return <AwesomeComponent onClick={stableHandleClick} />
}
```

In this example, `useStableFn` from `@shined/react-use` is used to ensure that the `onClick` function does not cause re-renders. For more usage see [useStableFn](/reference/use-stable-fn).

This approach not only makes the component more efficient but also prevents potential bugs related to re-rendering cycles. The Hook abstracts the complexity involved in memoizing functions, making it straightforward for developers to implement.
