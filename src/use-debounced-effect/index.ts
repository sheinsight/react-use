import { useEffect } from 'react'
import { createDebouncedEffect } from '../utils/create-effect/debounced'

import type { DebounceOptions } from '../utils/debounce'

export interface UseDebouncedEffectOptions extends DebounceOptions {}

/**
 * like `React.useEffect` but it's debounced
 */
export const useDebouncedEffect = createDebouncedEffect(useEffect)
