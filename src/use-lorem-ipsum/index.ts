import { useCreation } from '../use-creation'
import { isNumber, isObject } from '../utils/basic'

import { generateLoremIpsum } from './generate-lorem-ipsum'
export { generateLoremIpsum } from './generate-lorem-ipsum'

export interface UseLoremIpsumOptions {
  /**
   * The length of the generated text sentence.
   *
   * @default 1
   */
  length?: number
  /**
   * The minimum number of words in a sentence.
   *
   * @default ['.', '!', '?']
   */
  sentenceEnds?: string[]
  /**
   * Whether to keep the same value between renders.
   *
   * @default true
   */
  stable?: boolean
}

export function useLoremIpsum(n?: number): string
export function useLoremIpsum(options?: UseLoremIpsumOptions): string
export function useLoremIpsum(arg?: number | UseLoremIpsumOptions): string {
  const stable = isObject(arg) ? arg.stable : true
  const stableState = useCreation(() => getUseLoremIpsumReturn(arg), [arg])
  return stable ? stableState : getUseLoremIpsumReturn(arg)
}

export function getUseLoremIpsumReturn(arg?: number | UseLoremIpsumOptions): string {
  if (isNumber(arg)) return generateLoremIpsum(arg)
  if (isObject(arg)) return generateLoremIpsum(arg.length)
  return generateLoremIpsum(arg)
}
