import { useMemo } from 'react'
import { useClamp } from '../use-clamp'
import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { useUpdateEffect } from '../use-update-effect'

export interface UsePaginationOptions<T> {
  /**
   * Total number of items.
   *
   * @defaultValue Number.POSITIVE_INFINITY
   */
  total?: number
  /**
   * The number of items to display per page.
   *
   * @defaultValue 10
   */
  pageSize?: number
  /**
   * The current page number.
   *
   * @defaultValue 1
   */
  page?: number
  /**
   * The original list to be paginated.
   */
  list?: T[]
  /**
   * Callback when the `page` change.
   *
   * @param {PaginationInfo} pagination - `PaginationInfo`, the pagination info
   * @returns {void} `void`
   */
  onPageChange?: (pagination: UsePaginationReturnsState) => void
  /**
   * Callback when the `pageSize` change.
   *
   * @param {PaginationInfo} pagination - `PaginationInfo`, the pagination info
   * @returns {void} `void`
   */
  onPageSizeChange?: (pagination: UsePaginationReturnsState) => void
  /**
   * Callback when the `pageCount` change.
   *
   * @param {PaginationInfo} pagination - `PaginationInfo`, the pagination info
   * @returns {void} `void`
   */
  onPageCountChange?: (pagination: UsePaginationReturnsState) => void
}

export interface UsePaginationReturnsState<T = any> {
  /**
   * Total number of items.
   */
  total: number
  /**
   * The current page number.
   */
  currentPage: number
  /**
   * The number of items to display per page.
   */
  currentPageSize: number
  /**
   * The total number of pages.
   */
  pageCount: number
  /**
   * The start index of the displayed list (helpful to slice the list).
   */
  indexStart: number
  /**
   * The end index of the displayed list (helpful to slice the list).
   */
  indexEnd: number
  /**
   * Whether the current page is the first page.
   */
  isFirstPage: boolean
  /**
   * Whether the current page is the last page.
   */
  isLastPage: boolean
  /**
   * The sliced list to display.
   */
  list: T[]
}

export interface UsePaginationReturnsActions {
  /**
   * Go to the previous page.
   *
   * @returns {void} `void`
   */
  prev(): void
  /**
   * Go to the next page.
   *
   * @returns {void} `void`
   */
  next(): void
  /**
   * Go to the specified page.
   *
   * @param {number} page - `number`, the page number
   * @returns {void} `void`
   */
  go: (page: number) => void
  /**
   * Set the number of items to display per page.
   *
   * @param {number} size - `number`, the number of items to display per page
   * @returns {void} `void`
   */
  setPageSize: (size: number) => void
}

export type UsePaginationReturns<T> = readonly [UsePaginationReturnsState<T>, UsePaginationReturnsActions]

/**
 * A React Hook that manage pagination state.
 */
export function usePagination<T = any>(options: UsePaginationOptions<T> = {}): UsePaginationReturns<T> {
  const {
    total = Number.POSITIVE_INFINITY,
    page = 1,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    onPageCountChange,
  } = options

  const isInfinity = total === Number.POSITIVE_INFINITY
  const [currentPageSize, sizeActions] = useClamp(pageSize, 1, Number.POSITIVE_INFINITY)
  const pageCount = Math.max(1, Math.ceil(total / currentPageSize))
  const [currentPage, pageActions] = useClamp(page, 1, pageCount)

  const go = useStableFn((page: number) => pageActions.set(page))
  const prev = useStableFn(() => pageActions.dec())
  const next = useStableFn(() => pageActions.inc())
  const setPageSize = useStableFn((size: number) => sizeActions.set(size))

  const [indexStart, indexEnd] = [(currentPage - 1) * currentPageSize, Math.min(currentPage * currentPageSize, total)]

  const slicedList = useMemo(
    () => (options.list ?? []).slice(indexStart, indexEnd),
    [options.list, indexStart, indexEnd],
  )

  const pagination = {
    total,
    currentPage,
    currentPageSize,
    pageCount,
    indexStart,
    indexEnd,
    isFirstPage: currentPage === 1,
    isLastPage: isInfinity ? false : currentPage === pageCount,
    list: slicedList,
  }

  const latest = useLatest({ pagination, onPageChange, onPageCountChange, onPageSizeChange })

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when currentPage changes
  useUpdateEffect(() => {
    latest.current.onPageChange?.(latest.current.pagination)
  }, [currentPage])

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when pageCount changes
  useUpdateEffect(() => {
    latest.current.onPageCountChange?.(latest.current.pagination)
  }, [pageCount])

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when currentPageSize changes
  useUpdateEffect(() => {
    latest.current.onPageSizeChange?.(latest.current.pagination)
  }, [currentPageSize])

  const actions = useCreation(() => ({ go, prev, next, setPageSize }))

  return [pagination, actions] as const
}
