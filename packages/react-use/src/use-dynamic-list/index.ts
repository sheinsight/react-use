import { useRef } from 'react'
import { useCreation } from '../use-creation'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { isDev } from '../utils/basic'

import type { ReactSetState } from '../use-safe-state'

export interface UseDynamicListReturnsActions<T> {
  /**
   * insert an item at the specified index
   */
  insert: (index: number, item: T) => void
  /**
   * merge items at the specified index
   */
  merge: (index: number, items: T[]) => void
  /**
   * replace an item at the specified index
   */
  replace: (index: number, item: T) => void
  /**
   * remove an item at the specified index
   */
  remove: (index: number) => void
  /**
   * get the key of the item at the specified index
   */
  getKey: (index: number) => number
  /**
   * get the index of the item with the specified key
   */
  getIndex: (key: number) => number
  /**
   * move an item from the old index to the new index
   */
  move: (oldIndex: number, newIndex: number) => void
  /**
   * push an item to the end of the list
   */
  push: (item: T) => void
  /**
   * pop an item from the end of the list
   */
  pop(): void
  /**
   * unshift an item to the start of the list
   */
  unshift: (item: T) => void
  /**
   * shift an item from the start of the list
   */
  shift(): void
  /**
   * sort the list in place
   */
  sort: (compare?: (pre: T, next: T) => number) => void
  /**
   * reset the list
   */
  reset: (newList: T[]) => void
  /**
   * set the list
   */
  setList: ReactSetState<T[]>
}

export type UseDynamicListReturns<T> = readonly [
  /**
   * list of items
   */
  list: T[],
  UseDynamicListReturnsActions<T>,
]

/**
 * A React Hook that helps to manage dynamic list of items.
 */
export function useDynamicList<T>(initialList: T[] = []): UseDynamicListReturns<T> {
  const listIdxRef = useRef(0)
  const keysRef = useRef<number[]>([])

  function updateInternalKeyAt(index: number) {
    keysRef.current.splice(index, 0, listIdxRef.current++)
  }

  const [list, setList] = useSafeState(() => {
    initialList.forEach((_, index) => updateInternalKeyAt(index))
    return initialList
  })

  const reset = useStableFn((newList: T[]) => {
    keysRef.current.length = 0
    setList(() => {
      newList.forEach((_, index) => updateInternalKeyAt(index))
      return newList
    })
  })

  const insert = useStableFn((index: number, item: T) => {
    setList((list) => {
      const temp = [...list]
      temp.splice(index, 0, item)
      updateInternalKeyAt(index)
      return temp
    })
  })

  const getIndex = useStableFn((key: number) => keysRef.current.findIndex((ele) => ele === key))
  const getKey = useStableFn((index: number) => keysRef.current[index])

  const merge = useStableFn((index: number, items: T[]) => {
    setList((list) => {
      const temp = [...list]
      items.forEach((_, i) => updateInternalKeyAt(index + i))
      temp.splice(index, 0, ...items)
      return temp
    })
  })

  const replace = useStableFn((index: number, item: T) => {
    setList((list) => {
      const temp = [...list]
      temp[index] = item
      return temp
    })
  })

  const remove = useStableFn((index: number) => {
    setList((list) => {
      const temp = [...list]
      temp.splice(index, 1)
      try {
        keysRef.current.splice(index, 1)
      } catch (e) {
        if (isDev) console.error(e)
      }
      return temp
    })
  })

  const move = useStableFn((preIndex: number, nextIndex: number) => {
    if (preIndex === nextIndex) return
    setList((list) => {
      const newList = [...list]
      const temp = newList.filter((_, index: number) => index !== preIndex)
      temp.splice(nextIndex, 0, newList[preIndex])
      try {
        const keyTemp = keysRef.current.filter((_, index: number) => index !== preIndex)
        keyTemp.splice(nextIndex, 0, keysRef.current[preIndex])
        keysRef.current = keyTemp
      } catch (e) {
        if (isDev) console.error(e)
      }

      return temp
    })
  })

  const push = useStableFn((item: T) => {
    setList((list) => {
      updateInternalKeyAt(list.length)
      return list.concat([item])
    })
  })

  const pop = useStableFn(() => {
    try {
      keysRef.current = keysRef.current.slice(0, keysRef.current.length - 1)
    } catch (e) {
      if (isDev) console.error(e)
    }

    setList((list) => list.slice(0, list.length - 1))
  })

  const unshift = useStableFn((item: T) => {
    setList((list) => {
      updateInternalKeyAt(0)
      return [item].concat(list)
    })
  })

  const shift = useStableFn(() => {
    try {
      keysRef.current = keysRef.current.slice(1, keysRef.current.length)
    } catch (e) {
      if (isDev) console.error(e)
    }
    setList((list) => list.slice(1, list.length))
  })

  const sort = useStableFn((compare?: (pre: T, next: T) => number) => {
    setList((list) => {
      const temp = [...list]
      const result = temp.sort(compare)
      result.forEach((_, index) => updateInternalKeyAt(index))
      return result
    })
  })

  const actions = useCreation(() => ({
    insert,
    merge,
    replace,
    remove,
    getKey,
    getIndex,
    move,
    push,
    pop,
    unshift,
    shift,
    sort,
    reset,
    setList,
  }))

  return [list, actions] as const
}
