import { useRef } from 'react'
import { useCreation } from '../use-creation'
import { useRender } from '../use-render'
import { useStableFn } from '../use-stable-fn'
import { shallowEqual } from '../utils/equal'

export type UseTrackedRefStateRefState<S> = { [K in keyof S]: { used: boolean; value: S[K] } }

export function useTrackedRefState<S extends object, Keys extends keyof S = keyof S>(refState: S) {
  const render = useRender()

  const stateRef = useRef(
    useCreation(() => {
      const result = {} as UseTrackedRefStateRefState<S>
      for (const key in refState) {
        result[key] = { used: false, value: refState[key] }
      }
      return result
    }),
  )

  const updateRefState = useStableFn(
    <K extends keyof S>(
      key: K,
      newValue: S[K],
      compare: (prevData: S[K], nextData: S[K]) => boolean = shallowEqual,
    ) => {
      const refItem = stateRef.current[key]
      if (shallowEqual(refItem.value, newValue)) return

      const isValueChanged = !compare(refItem.value, newValue)

      if (isValueChanged) {
        refItem.value = newValue
        refItem.used && render()
      }
    },
  )

  const markKeyAsUsed = useStableFn(<K extends Keys>(key: K) => {
    stateRef.current[key].used = true
  })

  const actions = useCreation(() => ({
    updateRefState,
    markKeyAsUsed,
  }))

  const getters = useCreation(() => {
    const result = {} as S
    for (const key in stateRef.current) {
      Object.defineProperty(result, key, {
        enumerable: true,
        get() {
          markKeyAsUsed(key as unknown as Keys)
          return stateRef.current[key].value
        },
      })
    }
    return result
  })

  return [getters, actions, stateRef.current] as const
}
