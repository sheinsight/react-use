import { useEffect } from 'react'
import { createEffectOnce } from '../utils/create-effect/once'

/**
 * A React Hook like [React.useEffect](https://react.dev/reference/react/useEffect) but only run once, with more **semantic** name.
 *
 * It's merely an alias to `useEffect` with an empty dependency array.
 */
export const useEffectOnce = createEffectOnce(useEffect)
