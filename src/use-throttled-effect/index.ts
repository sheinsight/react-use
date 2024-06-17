import { useEffect } from 'react'
import { createThrottledEffect } from '../utils/create-effect/throttled'

import type { ThrottleOptions } from '../utils/throttle'

export interface UseThrottledEffectOptions extends ThrottleOptions {}

/**
 * like `React.useEffect`, but throttled.
 */
export const useThrottledEffect = createThrottledEffect(useEffect)
