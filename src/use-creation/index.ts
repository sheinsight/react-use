import { useRef } from 'react'
import { deepEqual } from '../utils/equal'

import type { DependencyList } from 'react'

interface CreationRefState<T> {
  value?: T
  created?: boolean
  preDeps?: DependencyList
}

export function useCreation<T>(create: () => T, currDeps?: DependencyList): T {
  const { current: creation } = useRef<CreationRefState<T>>({})

  if (!creation.created || !deepEqual(creation.preDeps, currDeps)) {
    creation.value = create()
    creation.created = true
    creation.preDeps = currDeps
  }

  return creation.value as T
}
