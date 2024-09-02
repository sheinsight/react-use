import { useUpdateEffect } from '../use-update-effect'
import { createAsyncEffect } from '../utils/create-effect/async'

import type { AsyncEffectCallback } from '../utils/create-effect/async'

export interface UseAsyncUpdateEffectCallback extends AsyncEffectCallback {}

/**
 * A React Hook which is like `useAsyncEffect` but **ignore the execution at first mount**.
 *
 * It should not return a cleanup function as it's `async` which cannot cleanup as expected.
 *
 * If you need to cleanup something, use `isCancelled` in {@link UseAsyncEffectCallback} instead to check effect status.
 *
 * @param {UseAsyncUpdateEffectCallback} asyncEffectCallback - `UseAsyncUpdateEffectCallback`, a callback function for async effect, see {@link UseAsyncUpdateEffectCallback}
 * @param {DependencyList} [deps] - `DependencyList`, an array of dependencies, see [React.useEffect](https://react.dev/reference/react/useEffect)
 *
 */
export const useAsyncUpdateEffect = createAsyncEffect(useUpdateEffect)
