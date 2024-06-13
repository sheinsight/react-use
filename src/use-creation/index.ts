import { useRef } from 'react'
import { deepEqual } from '../utils/equal'

import type { DependencyList } from 'react'

interface CreationRefState<T> {
  value?: T
  created?: boolean
  preDeps?: DependencyList
}

export function useCreation<T>(create: () => T, deps?: DependencyList): T {
  const { current: state } = useRef<CreationRefState<T>>({})

  if (!state.created || !deepEqual(state.preDeps, deps)) {
    state.value = create()
    state.created = true
    state.preDeps = deps
  }

  return state.value as T
}
