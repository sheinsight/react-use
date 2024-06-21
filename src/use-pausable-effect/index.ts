import { useEffect } from 'react'
import { createPausableEffect } from '../utils/create-effect/pausable'

/**
 * A React Hook like [React.useEffect](https://react.dev/reference/react/useEffect), but pausable.
 */
export const usePausableEffect = createPausableEffect(useEffect)
