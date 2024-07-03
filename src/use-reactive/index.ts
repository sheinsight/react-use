import { useCreation } from '../use-creation'
import { isFunction } from '../utils/basic'

import type { create } from '@shined/reactive'

// TODO: export from @shined/reactive
interface SnapshotOptions<StateSlice> {
  sync?: boolean
  isEqual?: (a: StateSlice, b: StateSlice) => boolean
}

export type UseReactiveOptions<State> = SnapshotOptions<State> & { create: typeof create }

/**
 * A React Hook that helps to use [Reactive](https://sheinsight.github.io/reactive) in React with ease.
 */
export function useReactive<State extends object>(
  initialState: State,
  options: UseReactiveOptions<State>,
): readonly [State, State] {
  const store = useCreation(() => {
    if (!isFunction(options.create)) {
      throw new Error('Please provide the `create` function from `@shined/reactive`')
    }

    return options.create(initialState)
  })

  return [
    store.useSnapshot({
      sync: options.sync,
      isEqual: options.isEqual,
    }),
    store.mutate,
  ] as const
}
