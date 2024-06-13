import { useEffect } from 'react'
import { createThrottledEffect } from '../utils'

import type { ThrottleOptions } from '../utils'

export interface UseThrottledEffectOptions extends ThrottleOptions {}

/**
 * like `React.useEffect`, but throttled.
 */
export const useThrottledEffect = createThrottledEffect(useEffect)
