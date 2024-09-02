import { useDeepCompareEffect } from '../use-deep-compare-effect'
import { useGetterRef } from '../use-getter-ref'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useStableFn } from '../use-stable-fn'
import { useUnmount } from '../use-unmount'
import { isFunction } from '../utils/basic'
import { unwrapGettable } from '../utils/unwrap'

import type { Gettable } from '../utils/basic'

/**
 * `%s` will be replaced by the title if the template is a `string`
 */
export type UseTitleOptionsTemplate = string | ((title: string) => string)

export type UseTitleOptions = {
  /**
   * Restore the original title when unmounted
   *
   * @defaultValue false
   */
  restoreOnUnmount?: boolean
  /**
   * A template to format the title
   *
   * @defaultValue '%s'
   */
  template?: UseTitleOptionsTemplate
}

/**
 * A React Hook that helps to manage the title of the document.
 */
export function useTitle(newTitle: Gettable<string>, options: UseTitleOptions = {}) {
  const [originalTitleRef, originalTitle] = useGetterRef('')
  const { template = '%s', restoreOnUnmount = false } = options

  const latest = useLatest({ template, restoreOnUnmount })
  const nextTitle = unwrapGettable(newTitle)

  useMount(() => {
    originalTitleRef.current = document.title
  })

  useDeepCompareEffect(() => {
    document.title = format(nextTitle, latest.current.template)
  }, [nextTitle])

  const restore = useStableFn(() => {
    document.title = originalTitle()
  })

  useUnmount(() => {
    if (latest.current.restoreOnUnmount) {
      restore()
    }
  })

  return restore
}

function format(text: string, template: UseTitleOptionsTemplate) {
  return isFunction(template) ? template(text) : template.replace(/%s/g, text)
}
