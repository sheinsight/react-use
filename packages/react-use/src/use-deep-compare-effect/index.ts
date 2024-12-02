import { useEffect } from 'react'
import { createDeepCompareEffect } from '../utils/create-effect/deep-compare'

import type { UseDeepCompareEffect } from '../utils/create-effect/deep-compare'

/**
 * A React Hook like [React.useEffect](https://react.dev/reference/react/useEffect), but with [deep comparison](https://github.com/sheinsight/react-use/blob/main/src/utils/equal.ts#L29) of dependencies.
 */
export const useDeepCompareEffect: UseDeepCompareEffect<never> = createDeepCompareEffect(useEffect)
