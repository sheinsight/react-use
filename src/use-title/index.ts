import { useRef } from 'react'
import { useDeepCompareEffect } from '../use-deep-compare-effect'
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
   * @default true
   */
  restoreOnUnmount?: boolean
  /**
   * A template to format the title
   *
   * @default '%s'
   */
  template?: UseTitleTemplate
}

export function useTitle(newTitle: string, options: UseTitleOptions = {}): () => string {
  const initialTitle = useRef('')
  const { template = '%s', restoreOnUnmount = true } = options

  const latest = useLatest({ template, restoreOnUnmount })

  useMount(() => {
    initialTitle.current = document.title
  })

  useDeepCompareEffect(() => {
    document.title = format(newTitle, latest.current.template)
  }, [newTitle])

  const restore = useStableFn(() => {
    document.title = initialTitle.current
  })

  useUnmount(() => {
    if (latest.current.restoreOnUnmount) {
      restore()
    }
  })

  return useStableFn(() => initialTitle.current)
}

function format(text: string, template: UseTitleTemplate) {
  return isFunction(template) ? template(text) : template.replace(/%s/g, text)
}
