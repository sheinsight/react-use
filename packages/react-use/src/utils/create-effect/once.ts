import type { EffectCallback } from 'react'
import type { ExtendedReactEffect } from '../basic'

export type UseEffectOnce<T> = (callback: EffectCallback, ...args: T[]) => void

export function createEffectOnce<T = unknown>(effect: ExtendedReactEffect<T>): UseEffectOnce<T> {
  return (callback: EffectCallback, ...args: T[]): void => {
    effect(callback, [], ...args)
  }
}
