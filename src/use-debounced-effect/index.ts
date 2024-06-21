import { useEffect } from 'react'
import { createDebouncedEffect } from '../utils/create-effect/debounced'

import type { DebounceOptions } from '../utils/debounce'

export interface UseDebouncedEffectOptions extends DebounceOptions {}

/**
 * A React Hook like [React.useEffect](https://react.dev/reference/react/useEffect), but debounced.
 */
export const useDebouncedEffect = createDebouncedEffect(useEffect)
