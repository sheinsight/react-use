# 📌 Stabilization

## Overview \{#overview}

In many cases, the re-rendering of React components is caused by changes in function references. Such changes can be due to the redeclaration of the function or changes in the dependencies of the function. In some cases, this re-rendering is necessary, but in other cases, it may be unnecessary or even harmful.

Stabilization ensures that function references remain unchanged during the component re-rendering process, unless explicitly triggered by dependency changes. This stabilization is crucial for optimizing rendering behavior in React, especially when integrating with performance-sensitive patterns like `React.memo` or `shouldComponentUpdate`.

## useStableFn \{#use-stable-fn}

We introduced [useStableFn](/reference/use-stable-fn) to implement and unify internal function stabilization operations. It prevents unnecessary re-renders by memorizing callback functions. With the stabilized function, developers can avoid performance bottlenecks and ensure components are updated only when necessary. Additionally, `useStableFn` utilizes [useLatest](/reference/use-latest) internally to ensure the executed function is always the latest, avoiding closure traps.

Every function exported by `@shined/react-use` is by default stabilized to ensure they do not cause unnecessary re-renders due to reasons other than changes in dependencies. Stabilizing callback functions minimizes the risk of causing them, thus improving performance and user experience.

## Example Usage \{#example-usage}

In fact, when you are using any function exposed by `@shined/react-use`, you are already using the stabilization feature. Here is a simple example showing how to use `useStableFn` to ensure the stability of callback functions:

```javascript
import { useStableFn } from '@shined/react-use'

function App() {
  const stableHandleClick = useStableFn(() => {
    // Do something
  })

  // `stableHandleClick` remains stable during re-renders, it will not cause re-render unless dependencies change
  return <AwesomeComponent onClick={stableHandleClick} />
}
```

In this example, `useStableFn` from `@shined/react-use` is used to ensure that the function passed to `onClick` does not cause re-rendering. For more usage, see [useStableFn](/reference/use-stable-fn).

## Real-World Implications \{#real-world-implications}

Stabilization is a key part of React optimization that ensures the performance and stability of components. Through stabilization, `@shined/react-use` offers developers a simple way to ensure the performance and stability of components while avoiding unnecessary re-renders.
