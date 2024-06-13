import { useUpdateEffect } from '../use-update-effect'
import { createAsyncEffect } from '../utils'

import type { AsyncEffectCallback } from '../utils'

export interface UseAsyncUpdateEffectCallback extends AsyncEffectCallback {}

/**
 * like `useUpdateEffect` but it's can accept an `async` function
 *
 * @tip it should not return a cleanup function as it's `async` which cannot cleanup as expected
 */
export const useAsyncUpdateEffect = createAsyncEffect(useUpdateEffect)
