import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { usePausable } from '../use-pausable'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'
import { useUpdateDeepCompareEffect } from '../use-update-deep-compare-effect'

import type { MutableRefObject } from 'react'
import type { Pausable } from '../use-pausable'

export interface UseUserMediaOptions {
  /**
   * Callback when MediaStream is ready
   */
  onStart?: (stream: MediaStream) => void
  /**
   * Callback when MediaStream is stopped
   */
  onStop?(): void
  /**
   * Recreate stream when deviceIds or constraints changed
   *
   * @defaultValue true
   */
  autoSwitch?: boolean
  /**
   * MediaStreamConstraints to be applied to the requested MediaStream
   * If provided, the constraints will override videoDeviceId and audioDeviceId
   *
   * @defaultValue {}
   */
  constraints?: MediaStreamConstraints
}

export interface UseUserMediaReturn extends Pausable {
  /**
   * The current MediaStream
   */
  stream: MutableRefObject<MediaStream | null>
  /**
   * Whether the browser supports getUserMedia
   */
  isSupported: boolean
}

export function useUserMedia(options: UseUserMediaOptions = {}): UseUserMediaReturn {
  const { autoSwitch = true, onStart, onStop, constraints = {} } = options

  const stream = useRef<MediaStream | null>(null)
  const isSupported = useSupported(() => 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)

  const clearStream = (triggerStop = true) => {
    for (const track of stream.current?.getTracks() || []) {
      track.stop()
    }
    triggerStop && latest.current.onStop?.()
    stream.current = null
  }

  const pausable = usePausable(
    false,
    () => clearStream(),
    async (ref) => {
      clearStream(false)
      ref.current = false

      stream.current = await navigator.mediaDevices.getUserMedia({
        video: getDeviceOptions('video'),
        audio: getDeviceOptions('audio'),
      })

      if (!stream.current) ref.current = true

      latest.current.onStart?.(stream.current)
    },
  )

  const latest = useLatest({ onStart, onStop, constraints })

  const getDeviceOptions = useStableFn((type: 'video' | 'audio') => {
    const { constraints } = latest.current
    switch (true) {
      case !!(type === 'video' && constraints):
        return constraints.video || false
      case !!(type === 'audio' && constraints):
        return constraints.audio || false
    }
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when options.constraints changes
  useUpdateDeepCompareEffect(() => {
    if (!pausable.isActive() || !autoSwitch) return
    pausable.resume()
    return pausable.pause
  }, [autoSwitch, options.constraints])

  return {
    stream,
    isSupported,
    ...pausable,
  }
}
