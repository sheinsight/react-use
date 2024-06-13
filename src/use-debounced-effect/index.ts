import { useEffect } from 'react'
import { createDebouncedEffect } from '../utils'

import type { DebounceOptions } from '../utils'

export interface UseDebouncedEffectOptions extends DebounceOptions {}

/**
 * like `React.useEffect` but it's debounced
 */
export const useDebouncedEffect = createDebouncedEffect(useEffect)
