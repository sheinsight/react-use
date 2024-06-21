import { create } from '@shined/reactive'
import { useCreation } from '../use-creation'

// TODO: export from @shined/reactive
interface SnapshotOptions<StateSlice> {
  sync?: boolean
  isEqual?: (a: StateSlice, b: StateSlice) => boolean
}

/**
 * A React Hook that helps to use [Reactive](https://sheinsight.github.io/reactive) in React with ease.
 */
export function useReactive<State extends object>(initialState: State): [State, State]
export function useReactive<State extends object>(initialState: State, options?: SnapshotOptions<State>): [State, State]
export function useReactive<State extends object>(
  initialState: State,
  options: SnapshotOptions<State> = {},
): [State, State] {
  const store = useCreation(() => create(initialState))
  return [store.useSnapshot(options), store.mutate] as const
}
