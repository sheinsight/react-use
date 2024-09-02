import { useUpdateDeepCompareEffect } from '../use-update-deep-compare-effect'
import { createPausableEffect } from '../utils/create-effect/pausable'

/**
 * A React Hook like [useUpdateDeepCompareEffect](https://sheinsight.github.io/react-use/reference/use-update-deep-compare-effect), but pausable.
 */
export const usePausableUpdateDeepCompareEffect = createPausableEffect(useUpdateDeepCompareEffect)
