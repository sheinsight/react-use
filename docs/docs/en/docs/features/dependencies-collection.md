# 🕸 Dependencies Collection

`@shined/react-use` serves as a fundamental utility library where performance is paramount. To ensure flexibility and a rich set of features while minimizing performance overhead as much as possible, we've introduced the concept of Dependencies Collection.

> The idea of Dependency Collection originally came from [SWR](https://swr.vercel.app/docs/advanced/performance#dependency-collection). We have made some improvements and optimizations on this basis.

## TL; DR {#tl-dr}

- To provide flexible and rich features, many Hooks internally need to manage and return numerous states
- Users may not need to consume all of the states, only a portion, but any state change can lead to re-rendering
- To reduce unnecessary rendering overhead, we introduced the concept of "Dependencies Collection"
- Only the states that are used and changed will trigger rendering, which is imperceptible to users but can significantly improve performance

## Motivation

Inside `@shined/react-use`, there's a `useQuery` that returns various states including, but not limited to, `data`, `loading`, `error` for implementing multiple features. Normally, regardless of whether the returned states are used or not, any change in the corresponding states would invoke operations like `setState(loading)` to update the state.

This operational logic is not problematic in itself. The issue arises when updates are still made even if certain states are not actually used by the user, leading to unnecessary rendering overhead and greatly decreasing rendering performance.

```tsx
// The user actually only needs the run operation and the loading state, not caring about error or data
const { run, data } = useQuery(requestSomething, options)

// The user performs the run operation
run()

// When data, error, loading changes, internal `setState` operation will cause the component to re-render
```

In some scenarios (like above), we might only need one of the states, such as `data`, and not the others. To achieve this, we introduced the concept of dependency collection, allowing users to inform `@shined/react-use` which states they care about and which they do not through the passing of dependencies.

```tsx
// Users take what they need from the return values
const { run, data } = useQuery(requestSomething, options)

// The user performs the run operation
run()

// When data changes, internal `setState` operation will cause the component to re-render

// As for error, loading, even if they change, it will not trigger re-rendering because the user did not actually use them
```

A component that originally needed to render 4~5 times may now only need to render 1~2 times, which undoubtedly represents a substantial improvement in performance.

## Hooks That Implemented Dependency Collection {#hooks-that-implemented-dependencies-collection}

- [useAsyncFn](/reference/use-async-fn)
- [useClipboard](/reference/use-clipboard)
- [useClipboardItems](/reference/use-clipboard-items)
- [useLoadingSlowFn](/reference/use-loading-slow-fn)
- [useQuery](/reference/use-query)
- [~~useRequest (Deprecated, please use useQuest)~~](/reference/use-request)

Due to the substantial amount of work involved, we've only optimized some Hooks for dependency collection so far. We plan to gradually optimize other Hooks in the future.

## Implementation {#implementation}

The implementation principle is actually quite simple. It only requires maintaining a `ref` internally while marking the returned state through `getter` functions during exposure. When a user uses a certain state, mark that state as "used". When changing, determine whether rerendering should be triggered.

Below is a simple pseudocode to demonstrate the underlying principle of dependency collection:

```tsx
// Use useRef instead of useState to define status because we want to manually control the update of the state
const stateRef = useRef({
  name: { used: false, value: 'react-use' },
  age: { used: false, value: 18 },
})

// Use the setState function to manually update the status, while determining whether rerendering is required
function setState(key: string, value: any) {
  if(stateRef.current[key].value === value) return
  stateRef.current[key].value = value
  if (stateRef.current[key].used) render()
}

// The return value is exposed through a getter function, which also marks whether the state is used in the getter function
const returnedState = {
  get name() {
    stateRef.current.name.used = true
    return stateRef.current.name.value
  },
  get age() {
    stateRef.current.age.used = true
    return stateRef.current.age.value
  },
}
```

Through such means, we can implement a simple dependency collection system, where only the states that are used by the user will trigger re-rendering. Internally in `@shine/react-use`, this whole logic is integrated into the `useTrackedRefState()` Hook (not yet exposed externally), used to implement the functionality of dependency collection.
