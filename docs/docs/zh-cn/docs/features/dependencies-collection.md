# 🕸 依赖收集（Dependencies Collection） {#dependencies-collection}

`@shined/react-use` 作为基础的底层工具库，性能是重中之重，为了在确保灵活性、功能丰富的前提下尽可能地减少性能开销，我们引入了依赖收集（Dependencies Collection）的概念。

> 依赖收集的想法最初来源于 [SWR](https://swr.vercel.app/docs/advanced/performance#dependency-collection)，在此基础上我们进行了一些改进和优化。

## 简而言之 {#tl-dr}

- 为了提供灵活、丰富的功能，许多 Hooks 内部需要管理和返回许多状态（State）
- 用户可能并不需要消费所有的状态，只用到了其中的一部分，但是任意状态变化都会导致重渲染
- 为了减少不必要的渲染开销，我们引入了「依赖收集（Dependencies Collection）」的概念
- 只有用到的状态发生变化时才会触发渲染，这对用户来说是无感的，但是可以显著提升性能

## 动机

有许多 Hooks 内部管理和返回了许多状态，用户可能只需要其中的一个或某几个状态，但是任意状态变化都会导致重渲染，造成不必要的性能开销。

例如，在 `@shined/react-use` 内部有一个 `useQuery`，它为了实现诸多功能特性，返回了包括但不限于 `data`、`loading`、`error` 等多个状态。正常情况下，无论是否使用了返回的状态，只要对应状态发生了变更，内部就会调用类似 `setState(loading)` 的操作来更新状态。

这个操作逻辑本身并没有问题，问题在于，当用户实际上并未使用某些状态时仍然会进行更新，导致了不必要的渲染开销，极大降低了渲染性能。

```tsx
// 用户实际上只需要 run 操作和 loading 这一个状态，对于 error、data 其实并不关心
const { run, data } = useQuery(requestSomething, options)

// 用户执行 run 操作
run()

// 当 data、error、loading 改变时，内部会触发 `setState` 操作导致组件重新渲染
```

在某些场景下（如上），我们可能只需要其中的一个状态，比如 `data`，而不需要其他状态。为了实现这一点，我们引入了依赖收集的概念，这对用户是无感的，但是可以显著提升性能。

```tsx
// 用户需要什么，就从返回值里面取什么
const { run, data } = useQuery(requestSomething, options)

// 用户执行 run 操作
run()

// 当 data 改变时，内部会触发 `setState` 操作导致组件重新渲染

// 而对于 error、loading，即使改变了也不会触发重新渲染，因为用户并没有实际用到
```

也就是说，对用户来说，需要什么状态就取什么状态，无关的状态不会触发重新渲染。这样一来，原本需要渲染 4~5 次的组件，现在可能只需要渲染 1~2 次，这对于性能提升来说，无疑是相当巨大的。

## 实现了依赖收集的 Hooks {#hooks-that-implemented-dependencies-collection}

- [useAsyncFn](/reference/use-async-fn)
- [useClipboard](/reference/use-clipboard)
- [useClipboardItems](/reference/use-clipboard-items)
- [useLoadingSlowFn](/reference/use-loading-slow-fn)
- [useQuery](/reference/use-query)
- [~~useRequest（已弃用，请使用 useQuest）~~](/reference/use-request)

由于工作量巨大，我们目前只对部分 Hooks 进行了依赖收集的优化，未来会逐步对其他 Hooks 进行优化。

## 实现原理 {#implementation}

实现原理其实很简单，只需要在内部维护一个 `ref`，同时在暴露返回值时，通过 `getter` 函数进行标记，当用户使用到某个状态时，将这个状态标记为「已使用」，在变更时判断是否需要触发重新渲染。

下面是一个简单的伪代码来演示依赖收集的底层原理：

```tsx
// 使用 useRef 而不是 useState 来定义状态，因为我们希望手动控制状态的更新
const stateRef = useRef({
  name: { used: false, value: 'react-use' },
  age: { used: false, value: 18 },
})

// 通过 setState 函数来手动更新状态，同时判断是否需要触发重新渲染
function setState(key: string, value: any) {
  if(stateRef.current[key].value === value) return
  stateRef.current[key].value = value
  if (stateRef.current[key].used) render()
}

// 返回值通过 getter 函数暴露，同时在 getter 函数中标记状态是否被使用
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

通过这样的方式，我们可以实现一个简单的依赖收集系统，只有当用户使用到了某个状态时才会触发重新渲染。在 `@shine/react-use` 内部，这一整套逻辑被整合到 `useTrackedRefState()` Hook （目前尚未对外暴露）当中，用于实现依赖收集的功能。
