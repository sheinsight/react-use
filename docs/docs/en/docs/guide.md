# 🧭 Usage Guide \{#usage-guide}

`@shined/react-use` aims to **lead a new programming paradigm in reshaping React development**. It provides numerous high-quality, semantic hooks to help developers increase their efficiency, develop better programming habits, and reduce direct reliance on `useEffect` and `useState`, while also embracing a "hooks-first" approach to React development.

Below are usage guidelines for some common scenarios to help you make the best use of `@shined/react-use`.

## Replace useState \{#replace-use-state}

`useState` is a React hook for managing component state that nearly every React developer will use.

However, in earlier versions of React, `useState` could lead to unintended behavior. For instance, in React <= 17, calling `setState` after a component unmounts could **throw a confusing warning** (refer to [Safe State](/docs/optimization/safe-state)). Moreover, React uses shallow comparisons to determine if the state has changed, which can **cause unnecessary re-renders, thus affecting performance**.

### useSafeState

`useSafeState` is designed as a direct replacement for `useState` to avoid warning issues in lower React versions, and it behaves consistently with `useState` in newer React versions.

It also features an optional performance-optimization characteristic (`deep` option for deep comparison of state to decide updates, default `false`).

For more details, refer to [Safe State](/docs/optimization/safe-state) and [useSafeState](/reference/use-safe-state).

```tsx
const [name, setName] = useState('react')

// Replace with
const [name, setName] = useSafeState('react')
```

```tsx
const [state, setState] = useState({ count: 0 })
setState({ count: 0 }) // Triggers re-render
setState({ count: 0 }) // Triggers re-render
setState({ count: 0 }) // Triggers re-render

// Replace with
const [state, setState] = useSafeState({ count: 0 }, { deep: true })
setState({ count: 0 }) // Does not trigger re-render
setState({ count: 0 }) // Does not trigger re-render
setState({ count: 0 }) // Does not trigger re-render

// The `deep` option is optional; when state is simple, controllable, and the state's reference changes frequently but its actual value does not, it significantly reduces the number of renders
```

### useBoolean

`useBoolean` is used for managing boolean state, providing a series of semantic operation functions, such as `toggle`, `setTrue`, `setFalse`, etc., and it uses `useSafeState` underneath to ensure state safety.

Details can be found at [useBoolean](/reference/use-boolean).

```tsx
const [bool, actions] = useBoolean(false)

actions.toggle() // true
actions.setTrue() // true
actions.setFalse() // false
```

### useCounter

`useCounter` is used for managing number state, providing a series of semantic operation functions, such as `inc`, `dec`, `set`, etc., and it uses `useSafeState` underneath to ensure state safety.

Details can be found at [useCounter](/reference/use-counter).

```tsx
const [count, actions] = useCounter(0)

actions.inc() // 1
actions.inc(10) // 11
actions.dec() // 10
actions.set(20) // 20
```

## Reduce useEffect \{#reduce-use-effect}

`useEffect` is one of the most fundamental and commonly used Hooks in React, but generally, its direct usage is not recommended. This is because its usage can be quite primitive and prone to causing **side effects that are difficult to control or that do not match expectations**.

`@shined/react-use` provides a series of high-quality, semantic hooks that can replace certain `useEffect` usage scenarios equivalently.

### useMount

We might use `useEffect` like this, functionally equivalent to executing `doSomething()` once when the component mounts.

```tsx
// Not recommended
useEffect(() => {
  doSomething()
}, [])
```

Or, when we need to perform some asynchronous operations upon mounting and need to retrieve results, we typically wrap an async function to execute.

```tsx
// Not recommended
useEffect(() => {
  async function asyncWrapper() {
    const result = await doSomethingAsync()
    console.log(result)
  }

  asyncWrapper()
}, [])
```

The above code is logically correct but has many issues and risks, such as **poor readability, lack of semantics, difficult future maintenance, and the potential to accidentally return a cleanup function**, and also lacks friendly support for async functions. It's recommended to switch to a more semantically expressive `useMount`, which supports async functions.

Details can be found at [useMount](/reference/use-mount).

```tsx
// Recommended
useMount(doSomething)

// Recommended
useMount(async () => {
  const result = await doSomethingAsync()
  console.log(result)
})
```

### useUnmount

`useUnmount` is used for performing operations when a component unmounts, such as cleaning up side effects, fairly similar to `useMount` but with a different timing.

Details can be found at [useUnmount](/reference/use-unmount).

```tsx
// Not recommended
useEffect(() => {
  return () => {
    doSomething()
  }
}, [])

// Recommended
useUnmount(doSomething)
```

### useUpdateEffect

`useUpdateEffect` is used for performing operations upon component updates, such as listening to certain state changes and executing actions, but **ignoring the initial render**, suitable for scenarios that do not require immediate side effects.

Details can be found at [useUpdateEffect](/reference/use-update-effect).

```tsx
// Not recommended
const isMount = useRef(false)

useEffect(() => {
  if (isMount.current) {
    doSomething()
  } else {
    isMount.current = true
  }
}, [state])
```

```tsx
// Recommended
useUpdateEffect(() => {
  doSomething()
}, [state])
```

### useEffectOnce

`useEffectOnce` is used for executing an operation once upon mounting and also once upon unmounting, suitable for scenarios that only require a one-time side effect. Essentially, `useEffectOnce` is a combination of `useMount` and `useUnmount`.

Details can be found at [useEffectOnce](/reference/use-effect-once).

```tsx
// Not recommended
useEffect(() => {
  doSomething()
  return () => clearSomething()
}, [])
```

```tsx
// Recommended
useEffectOnce(() => {
  doSomething()
  return () => clearSomething()
})
```

### useAsyncEffect

`useAsyncEffect` is used for executing asynchronous operations upon state changes, suitable for scenarios that need to listen to state changes and perform asynchronous operations.

Details can be found at [useAsyncEffect](/reference/use-async-effect).

```tsx
// Not recommended
useEffect(() => {
  async function asyncWrapper() {
    const result = await doSomethingAsync()
    // After the current Effect finishes, it might still execute subsequent logic, posing security risks like memory leaks
    doSomethingAfter(result)
  }

  asyncWrapper()
}, [state])
```

```tsx
// Recommended
useAsyncEffect(async (isCancelled) => {
  const result = await doSomethingAsync()
  
  if(isCancelled()) {
    // If the current Effect has finished, it will not execute subsequent logic
    clearSomething()
    return
  }

  doSomethingAfter(result)
}, [state])
```
