import { useCreation } from '@shined/react-use'
import { useDeepCompareEffect } from '../use-deep-compare-effect'
import { useGetterRef } from '../use-getter-ref'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useStableFn } from '../use-stable-fn'
import { useUnmount } from '../use-unmount'
import { isFunction } from '../utils/basic'

/**
 * `%s` will be replaced by the title if the template is a `string`
 */
export type UseTitleTemplate = string | ((title: string) => string)

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
  template?: UseTitleTemplate
}

export function useTitle(newTitle: string, options: UseTitleOptions = {}) {
  const [originalTitleRef, originalTitle] = useGetterRef('')
  const { template = '%s', restoreOnUnmount = false } = options

  const latest = useLatest({ template, restoreOnUnmount })

  useMount(() => {
    originalTitleRef.current = document.title
  })

  useDeepCompareEffect(() => {
    document.title = format(newTitle, latest.current.template)
  }, [newTitle])

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

function format(text: string, template: UseTitleTemplate) {
  return isFunction(template) ? template(text) : template.replace(/%s/g, text)
}
