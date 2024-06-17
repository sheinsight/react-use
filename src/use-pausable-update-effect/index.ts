import { useUpdateEffect } from '../use-update-effect'
import { createPausableEffect } from '../utils/create-effect/pausable'

/**
 * like `useUpdateEffect`, but can be paused.
 */
export const usePausableUpdateEffect = createPausableEffect(useUpdateEffect)
