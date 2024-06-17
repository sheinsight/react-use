import { useUpdateDeepCompareEffect } from '../use-update-deep-compare-effect'
import { createPausableEffect } from '../utils/create-effect/pausable'

/**
 * like `useUpdateDeepCompareEffect`, but can be paused.
 */
export const usePausableUpdateDeepCompareEffect = createPausableEffect(useUpdateDeepCompareEffect)
