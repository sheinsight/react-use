import { useEffect } from 'react'
import { createPausableEffect } from '../utils/create-effect/pausable'

/**
 * like `React.useEffect`, but can be paused.
 */
export const usePausableEffect = createPausableEffect(useEffect)
