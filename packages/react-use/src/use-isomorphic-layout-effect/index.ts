import { useEffect, useLayoutEffect } from 'react'
import { isClient } from '../utils/basic'

export type UseEffect = typeof useEffect

/**
 * A React Hook that will automatically use [React.useLayoutEffect](https://react.dev/reference/react/useLayoutEffect) in client side,
 *
 * and [React.useEffect](https://react.dev/reference/react/useEffect) in server side to avoid the warning of `useLayoutEffect` in Server-side Rendering (SSR).
 */
export const useIsomorphicLayoutEffect: UseEffect = isClient ? useLayoutEffect : useEffect
