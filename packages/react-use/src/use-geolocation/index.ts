import { useEffect, useRef } from 'react'
import { usePausable } from '../use-pausable'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'

import type { Pausable } from '../use-pausable'

export interface UseGeolocationOptions extends PositionOptions {
  /**
   * Whether to start watching the geolocation immediately.
   *
   * @defaultValue true
   */
  immediate?: boolean
}

export interface UseGeolocationReturns extends Pausable {
  /**
   * Whether the geolocation API is supported.
   */
  isSupported: boolean
  /**
   * The current latitude.
   */
  latitude: number | null
  /**
   * The current longitude.
   */
  longitude: number | null
  /**
   * The current geolocation state.
   */
  isLocating: boolean
  /**
   * The timestamp when the geolocation was last updated.
   */
  locatedAt: number | null
  /**
   * The error object if any.
   */
  error: GeolocationPositionError | null
  /**
   * The current geolocation coordinates.
   */
  coords: Omit<GeolocationPosition['coords'], 'latitude' | 'longitude'> & {
    latitude: number | null
    longitude: number | null
  }
}

/**
 * A React Hook that provides a simple way to get the user's [geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation).
 */
export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturns {
  const { enableHighAccuracy = true, maximumAge = 30000, timeout = 27000, immediate = true } = options

  const pausable = usePausable(
    false,
    (ref) => {
      ref.current = false
      if (watcherRef.current) {
        setState({ isLocating: false })
        navigator.geolocation.clearWatch(watcherRef.current)
        watcherRef.current = null
      }
    },
    (ref) => {
      ref.current = false
      setState({ isLocating: true })

      watcherRef.current =
        navigator?.geolocation.watchPosition(
          (e) => updatePosition(e),
          (error) => setState({ isLocating: false, error }),
          {
            enableHighAccuracy,
            maximumAge,
            timeout,
          },
        ) || null

      if (watcherRef.current) ref.current = true
    },
  )

  const isSupported = useSupported(() => 'geolocation' in navigator)

  const [state, setState] = useSetState({
    isLocating: false,
    locatedAt: null as number | null,
    error: null as GeolocationPositionError | null,
    coords: {
      accuracy: 0,
      latitude: null,
      longitude: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    } as Omit<GeolocationPosition['coords'], 'latitude' | 'longitude'> & {
      latitude: number | null
      longitude: number | null
    },
  })

  const watcherRef = useRef<number | null>(null)

  const updatePosition = useStableFn((position: GeolocationPosition) => {
    setState({
      isLocating: false,
      locatedAt: position.timestamp,
      error: null,
      coords: position.coords,
    })
  })

  useEffect(() => {
    if (isSupported) {
      immediate && pausable.resume()
      return pausable.pause
    }
  }, [isSupported, immediate])

  return {
    ...state,
    ...pausable,
    isSupported,
    latitude: state.coords.latitude,
    longitude: state.coords.longitude,
  }
}
