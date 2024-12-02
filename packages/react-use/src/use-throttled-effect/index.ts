import { useEffect } from 'react'
import { createThrottledEffect } from '../utils/create-effect/throttled'

import type { UseThrottledEffect } from '../utils/create-effect/throttled'
import type { ThrottleOptions } from '../utils/throttle'

export interface UseThrottledEffectOptions extends ThrottleOptions {}

/**
 * A React Hook like [React.useEffect](https://react.dev/reference/react/useEffect), but throttled.
 */
export const useThrottledEffect: UseThrottledEffect<never> = createThrottledEffect(useEffect)
