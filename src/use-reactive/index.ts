import { create } from '@shined/reactive'
import { useRef } from 'react'
import { useCreation } from '../use-creation'

// TODO: export from @shined/reactive
interface SnapshotOptions<StateSlice> {
  sync?: boolean
  isEqual?: (a: StateSlice, b: StateSlice) => boolean
}

export function useReactive<State extends object>(initialState: State): [State, State]
export function useReactive<State extends object>(initialState: State, options?: SnapshotOptions<State>): [State, State]
export function useReactive<State extends object>(
  initialState: State,
  options: SnapshotOptions<State> = {},
): [State, State] {
  const store = useRef(useCreation(() => create(initialState)))
  return [store.current.useSnapshot(options), store.current.mutate] as const
}
