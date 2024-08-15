# 🕸 Dependencies Collection

`@shined/react-use` serves as a basic underlying tool library where performance is paramount. To ensure flexibility and richness of features while minimizing performance overhead as much as possible, we have introduced the concept of "Dependencies Collection".

> The idea of dependency collection originally comes from [SWR](https://swr.vercel.app/docs/advanced/performance#dependency-collection), based on which we have made some improvements and optimizations.

## TL; DR {#tl-dr}

- To provide flexible and rich features, many Hooks internally manage and return many states.
- Users may not need to consume all states, only using part of them, but any change in the state leads to re-rendering.
- To reduce unnecessary rendering overhead, we introduced the concept of "Dependencies Collection".
- Only the change of the used state triggers rendering, which is imperceptible to users but can significantly enhance performance.

## Motivation

Many Hooks internally manage and return a lot of states. Users may only need one or some of these states, but any change in state causes re-rendering, leading to unnecessary performance overhead.

For instance, in `@shined/react-use` there's a `useQuery`, which, for implementing numerous feature characteristics, returns multiple states including but not limited to `data`, `loading`, `error`, etc. Normally, regardless of whether the returned states are used, any change in the corresponding state causes internal calls like `setState(loading)` to update the state.

This operation logic is not problematic in itself. The problem arises when updates occur despite the user not actually using some of the states, leading to unnecessary rendering overhead and significantly reducing rendering performance.

```tsx
// Users actually only need the run operation and this one state of loading; they're not really concerned about error or data
const { run, loading } = useQuery(requestSomething, options)

// User executes the run operation
run()

// When `data`, `error`, or `loading` changes, an internal `setState` operation is triggered causing the component to re-render
```

In certain scenarios (as above), we might only need one of the states, such as `loading`, and not the other states. To achieve this, we introduced the concept of dependency collection, which is imperceptible to users but can significantly enhance performance.

```tsx
// Users take what they need from the return value
const { run, data } = useQuery(requestSomething, options)

// User executes the run operation
run()

// When data changes, an internal `setState` operation is triggered causing the component to re-render

// However, for `error` or `loading`, even if they change, it doesn't trigger re-rendering because the user hasn't actually used them
```

In other words, users take whatever state they need, and unrelated states don't trigger re-rendering. This way, a component that originally needed to render 4~5 times now might only need to render 1~2 times. This represents a significant performance improvement.

## Hooks That Implemented Dependencies Collection {#hooks-that-implemented-dependencies-collection}

- [useAsyncFn](/reference/use-async-fn)
- [useClipboard](/reference/use-clipboard)
- [useClipboardItems](/reference/use-clipboard-items)
- [useLoadingSlowFn](/reference/use-loading-slow-fn)
- [useQuery](/reference/use-query)
- [~~useRequest (deprecated, please use useQuest)~~](/reference/use-request)

Due to the immense amount of work involved, we have only optimized the dependencies collection for some Hooks for now, planning to gradually optimize other Hooks in the future.

## Implementation {#implementation}

The underlying principle of implementation is actually quite simple. It only requires maintaining a `ref` internally and marking the state as "used" through the `getter` function when exposing return values. When a user uses a state, this state is marked as "used", and during changes, it is determined whether re-rendering is needed.

Below is a simple pseudocode to demonstrate the underlying principle of dependency collection:

```tsx
// Use useRef instead of useState to define states because we want to manually control the state's update
const stateRef = useRef({
  name: { used: false, value: 'react-use' },
  age: { used: false, value: 18 },
})

// Use the setState function to manually update the state, while determining if re-rendering is needed
function setState(key: string, value: any) {
  if(stateRef.current[key].value === value) return
  stateRef.current[key].value = value
  if (stateRef.current[key].used) render()
}

// Return values are exposed through getter functions, while marking whether the state is used in the getter function
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

Through such methods, we can implement a simple dependency collection system, where re-rendering is only triggered when the user uses a particular state. Within `@shined/react-use`, this entire set of logic has been integrated into the `useTrackedRefState()` Hook (not yet publicly exposed), to implement the dependencies collection feature.
