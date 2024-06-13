import { useClamp } from '../use-clamp'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { useUpdateEffect } from '../use-update-effect'

export interface UsePaginationOptions {
  /**
   * Total number of items.
   *
   * @default Number.POSITIVE_INFINITY
   */
  total?: number
  /**
   * The number of items to display per page.
   *
   * @default 10
   */
  pageSize?: number
  /**
   * The current page number.
   *
   * @default 1
   */
  page?: number
  /**
   * Callback when the `page` change.
   */
  onPageChange?: (pagination: PaginationInfo) => void
  /**
   * Callback when the `pageSize` change.
   */
  onPageSizeChange?: (pagination: PaginationInfo) => void
  /**
   * Callback when the `pageCount` change.
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
  /**
   * Go to the previous page.
   */
  prev(): void
  /**
   * Go to the next page.
   */
  next(): void
  /**
   * Go to the specified page.
   */
  go: (page: number) => void
  /**
   * Set the number of items to display per page.
   */
  setPageSize: (size: number) => void
}

export interface UsePaginationReturn extends PaginationInfo {}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
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
    go,
    prev,
    next,
    setPageSize,
  }

  const latest = useLatest({
    pagination,
    onPageChange,
    onPageCountChange,
    onPageSizeChange,
  })

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

  return pagination
}
