import { useEffect } from 'react'
import { createUpdateEffect } from '../utils/create-effect/update'

import type { UseUpdateEffect } from '../utils/create-effect/update'

/**
 * A React Hook like [React.useEffect](https://react.dev/reference/react/useEffect), but ignore the first invocation on mount.
 */
export const useUpdateEffect: UseUpdateEffect<never> = createUpdateEffect(useEffect)
