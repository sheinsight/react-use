import { useEffect } from 'react'
import { createAsyncEffect } from '../utils/create-effect/async'

import type { AsyncEffectCallback } from '../utils/create-effect/async'

export type UseAsyncEffectCallback = AsyncEffectCallback

/**
 * A React Hook similar to [React.useEffect](https://react.dev/reference/react/useEffect), but supports **cancellable** **asynchronous** functions.
 *
 * @param {AsyncEffectCallback} asyncEffectCallback - `AsyncEffectCallback`, a callback function for async effect, see {@link AsyncEffectCallback}
 * @param {DependencyList} [deps] - `DependencyList`, an array of dependencies, see [React.useEffect](https://react.dev/reference/react/useEffect)
 */
export const useAsyncEffect = createAsyncEffect(useEffect)
