import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useStableFn } from '../use-stable-fn'
import { useUnmount } from '../use-unmount'
import { createPromiseWithResolvers, isClient, noop } from '../utils/basic'

import type { MutableRefObject } from 'react'

export type ReferrerPolicy =
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url'

export interface UseScriptTagOptions {
  /**
   * Whether load script immediately at mount
   *
   * @default true
   */
  immediate?: boolean
  /**
   * Whether the script is loaded asynchronously
   *
   * @default true
   */
  async?: boolean
  /**
   * The type of the script
   *
   * @default 'text/javascript'
   */
  type?: string
  /**
   * Whether to control the loading of the script manually
   *
   * @default false
   */
  manual?: boolean
  /**
   * The value of the `crossorigin` attribute
   *
   * @default undefined
   */
  crossOrigin?: 'anonymous' | 'use-credentials'
  /**
   * The value of the `referrerpolicy` attribute
   *
   * @default undefined
   */
  referrerPolicy?: ReferrerPolicy
  /**
   * Whether the script is a module script
   *
   * @default undefined
   */
  noModule?: boolean
  /**
   * Whether the script is deferred
   *
   * @default false
   */
  defer?: boolean
  /**
   * Additional attributes to be set on the script element
   *
   * @default {}
   */
  attrs?: Record<string, string>
}

export type UseScriptTagReturn = {
  /**
   * The script element Ref
   */
  scriptTag: MutableRefObject<HTMLScriptElement | null>
  /**
   * Load the script
   *
   * @param waitForScriptLoad Whether to wait for the script to be loaded, `true` by default
   */
  load: (waitForScriptLoad?: boolean) => Promise<HTMLScriptElement | boolean>
  /**
   * Unload the script
   */
  unload(): void
}

export function useScriptTag(
  src: string,
  onLoaded: (el: HTMLScriptElement) => void = noop,
  options: UseScriptTagOptions = {},
): UseScriptTagReturn {
  const {
    immediate = true,
    manual = false,
    type = 'text/javascript',
    async = true,
    crossOrigin,
    referrerPolicy,
    noModule,
    defer,
    attrs = {},
  } = options

  const scriptTag = useRef<HTMLScriptElement | null>(null)
  const promiseRef = useRef<Promise<HTMLScriptElement | boolean> | null>(null)

  function loadScript(waitForScriptLoad = true): Promise<HTMLScriptElement | boolean> {
    const { promise, reject, resolve } = createPromiseWithResolvers<HTMLScriptElement | boolean>()

    if (!isClient) {
      resolve(false)
      return promise
    }

    function createScriptElement() {
      const el = document.createElement('script')
      el.type = type
      el.async = async
      el.src = src
      if (defer) el.defer = defer
      if (crossOrigin) el.crossOrigin = crossOrigin
      if (noModule) el.noModule = noModule
      if (referrerPolicy) el.referrerPolicy = referrerPolicy
      for (const [name, value] of Object.entries(attrs)) {
        el.setAttribute(name, value)
      }
      return el
    }

    function resolveWithElement(el: HTMLScriptElement) {
      scriptTag.current = el
      resolve(el)
    }

    let shouldAppend = false
    let el = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)

    if (!el) {
      el = createScriptElement()
      shouldAppend = true
    } else if (el.hasAttribute('data-loaded')) {
      resolveWithElement(el)
      return promise
    }

    el.addEventListener('error', (event) => reject(event))
    el.addEventListener('abort', (event) => reject(event))
    el.addEventListener('load', () => {
      if (!el) return
      el.setAttribute('data-loaded', 'true')
      onLoaded(el)
      resolveWithElement(el)
    })

    if (shouldAppend) el = document.head.appendChild(el)

    !waitForScriptLoad && resolveWithElement(el)

    return promise
  }

  const latest = useLatest({ loadScript })

  const load = useStableFn((waitForScriptLoad = true): Promise<HTMLScriptElement | boolean> => {
    if (!promiseRef.current) {
      promiseRef.current = latest.current.loadScript(waitForScriptLoad)
    }

    return promiseRef.current
  })

  const unload = useStableFn(() => {
    promiseRef.current = null
    if (scriptTag.current) scriptTag.current = null
    const el = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    el && document.head.removeChild(el)
  })

  useMount(() => immediate && !manual && load())

  useUnmount(() => !manual && unload())

  return {
    scriptTag,
    load,
    unload,
  }
}
