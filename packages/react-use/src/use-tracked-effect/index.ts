import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { useUpdateEffect } from '../use-update-effect'

import type { DependencyList as Deps } from 'react'

export type TrackedEffectCallback = (depIndexes: number[], previousDeps?: Deps, currentDeps?: Deps) => void

/**
 * A React Hook for detecting dependencies that have **actually changed** between renders, only run in development mode.
 */
export function useTrackedEffect(callback: TrackedEffectCallback, deps?: Deps): void {
  const previousDepsRef = useRef<Deps>()
  const latest = useLatest({ callback })

  // biome-ignore lint/correctness/useExhaustiveDependencies: for dev
  useUpdateEffect(() => {
    const depIndexes = findChangedIndexes(previousDepsRef.current, deps)

    const previousDeps = previousDepsRef.current
    previousDepsRef.current = deps

    return latest.current.callback(depIndexes, previousDeps, deps)
  }, deps)
}

function findChangedIndexes(depsA?: Deps, depsB?: Deps) {
  if (depsA) {
    return depsA.map((_, idx) => (!Object.is(depsA[idx], depsB?.[idx]) ? idx : -1)).filter((idx) => idx >= 0)
  }
  /* v8 ignore next */
  return (depsB || []).map((_, idx) => idx)
}
