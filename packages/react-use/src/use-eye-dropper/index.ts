import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'

export interface EyeDropperOpenOptions {
  /**
   * An AbortSignal to cancel the operation.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
   */
  signal?: AbortSignal
}

interface EyeDropperConstructor {
  new (): EyeDropper
}

type WindowWithEyedropper = Window &
  typeof globalThis & {
    EyeDropper: EyeDropper
  }

export interface EyeDropper extends EyeDropperConstructor {
  open: (options?: EyeDropperOpenOptions) => Promise<{ sRGBHex: string }>
  [Symbol.toStringTag]: 'EyeDropper'
}

export interface UseEyeDropperOptions {
  /**
   * Initial sRGBHex.
   *
   * @defaultValue ''
   */
  initialValue?: string
  /**
   * Whether to convert the sRGBHex to uppercase.
   *
   * @defaultValue true
   */
  upperCase?: boolean
  /**
   * Whether to keep the leading hash in the sRGBHex.
   *
   * @defaultValue true
   */
  keepLeadingHash?: boolean
}

export interface UseEyeDropperReturns {
  /**
   * Whether the EyeDropper is supported.
   */
  isSupported: boolean
  /**
   * The sRGBHex color value.
   */
  sRGBHex: string
  /**
   * Open the EyeDropper.
   *
   * @param options - The open options.
   */
  open: (options?: EyeDropperOpenOptions) => Promise<string | null>
}

/**
 * A React Hook that allows you to use the eye dropper tool to get the color of a pixel on the screen.
 */
export function useEyeDropper(options: UseEyeDropperOptions = {}): UseEyeDropperReturns {
  const { initialValue = '', upperCase = true, keepLeadingHash = true } = options

  const isSupported = useSupported(() => 'EyeDropper' in window)
  const [sRGBHex, setSRGBHex] = useSafeState(initialValue)

  const latest = useLatest({ isSupported, upperCase, keepLeadingHash })

  const open = useStableFn(async (openOptions?: EyeDropperOpenOptions) => {
    const { isSupported, upperCase, keepLeadingHash } = latest.current

    if (!isSupported) return null

    const eyeDropper: EyeDropper = new (window as WindowWithEyedropper).EyeDropper()
    const { sRGBHex = '' } = (await eyeDropper.open(openOptions)) || {}
    const hash = keepLeadingHash ? '#' : ''
    const hex = sRGBHex.slice(1)
    const formattedHex = upperCase ? hex.toUpperCase() : hex
    const color = hash + formattedHex

    setSRGBHex(color)

    return color
  })

  return {
    isSupported,
    sRGBHex,
    open,
  }
}
