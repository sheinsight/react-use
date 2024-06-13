import { useEffect } from 'react'
import { createAsyncEffect } from '../utils'

import type { AsyncEffectCallback } from '../utils'

export interface UseAsyncEffectCallback extends AsyncEffectCallback {}

/**
 * like `React.useEffect` but it's can accept an `async` function
 *
 * @tip it should not return a cleanup function as it's `async` which cannot cleanup as expected
 */
export const useAsyncEffect = createAsyncEffect(useEffect)
