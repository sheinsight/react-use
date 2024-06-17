import type { EffectCallback } from 'react'
import type { ExtendedReactEffect } from '../basic'

export function createEffectOnce<T = unknown>(effect: ExtendedReactEffect<T>) {
  return (callback: EffectCallback, ...args: T[]) => {
    effect(callback, [], ...args)
  }
}
