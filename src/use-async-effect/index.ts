import { useEffect } from 'react'
import { createAsyncEffect } from '../utils/create-effect/async'

import type { AsyncEffectCallback } from '../utils/create-effect/async'

export type UseAsyncEffectCallback = AsyncEffectCallback

/**
 * A React Hook which is like [React.useEffect](https://react.dev/reference/react/useEffect) but support **cancellable** **async** function.
 *
 * It should not return a cleanup function as it's `async` which cannot cleanup as expected.
 *
 * If you need to cleanup something, use `isCancelled` in {@link UseAsyncEffectCallback} instead to check effect status.
 *
 * @param {AsyncEffectCallback} asyncEffectCallback - `AsyncEffectCallback`, a callback function for async effect, see {@link AsyncEffectCallback}
 * @param {DependencyList} [deps] - `DependencyList`, an array of dependencies, see [React.useEffect](https://react.dev/reference/react/useEffect)
 */
export const useAsyncEffect = createAsyncEffect(useEffect)
