import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { createDeepCompareEffect } from '../utils/create-effect/deep-compare'

import type { UseDeepCompareEffect } from '../utils/create-effect/deep-compare'

/**
 * Same as [useDeepCompareEffect](https://sheinsight.github.io/react-use/reference/use-deep-compare-effect), but use `useLayoutEffect` instead of `useEffect`.
 */
export const useDeepCompareLayoutEffect: UseDeepCompareEffect<never> =
  createDeepCompareEffect(useIsomorphicLayoutEffect)
