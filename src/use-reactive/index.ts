import { useCreation } from '../use-creation'

import type { create } from '@shined/reactive'

// TODO: export from @shined/reactive
interface SnapshotOptions<StateSlice> {
  sync?: boolean
  isEqual?: (a: StateSlice, b: StateSlice) => boolean
}

/**
 * A React Hook that helps to use [Reactive](https://sheinsight.github.io/reactive) in React with ease.
 */
export function useReactive<State extends object>(initialState: State): readonly [State, State]
export function useReactive<State extends object>(
  initialState: State,
  options?: SnapshotOptions<State>,
): readonly [State, State]
export function useReactive<State extends object>(
  initialState: State,
  options: SnapshotOptions<State> = {},
): readonly [State, State] {
  const store = useCreation(() => {
    const createStore = require('@shined/reactive').create as typeof create
    return createStore(initialState)
  })

  return [store.useSnapshot(options), store.mutate] as const
}
