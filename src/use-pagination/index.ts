import { useClamp } from '../use-clamp'
import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { useUpdateEffect } from '../use-update-effect'

export interface UsePaginationOptions {
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
   * Callback when the `page` change.
   *
   * @param {PaginationInfo} pagination - `PaginationInfo`, the pagination info
   * @returns {void} `void`
   */
  onPageChange?: (pagination: PaginationInfo) => void
  /**
   * Callback when the `pageSize` change.
   *
   * @param {PaginationInfo} pagination - `PaginationInfo`, the pagination info
   * @returns {void} `void`
   */
  onPageSizeChange?: (pagination: PaginationInfo) => void
  /**
   * Callback when the `pageCount` change.
   *
   * @param {PaginationInfo} pagination - `PaginationInfo`, the pagination info
   * @returns {void} `void`
   */
  onPageCountChange?: (pagination: PaginationInfo) => void
}

export interface PaginationInfo {
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
   * Whether the current page is the first page.
   */
  isFirstPage: boolean
  /**
   * Whether the current page is the last page.
   */
  isLastPage: boolean
}

export type UsePaginationReturns = [
  PaginationInfo,
  {
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
  },
]

/**
 * A React Hook that manage pagination state.
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturns {
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

  const pagination = {
    total,
    currentPage,
    currentPageSize,
    pageCount,
    isFirstPage: currentPage === 1,
    isLastPage: isInfinity ? false : currentPage === pageCount,
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
