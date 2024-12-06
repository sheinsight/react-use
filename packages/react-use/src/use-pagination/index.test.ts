import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type UsePaginationOptions, usePagination } from './index'

describe('usePagination', () => {
  let options: UsePaginationOptions<number>

  beforeEach(() => {
    options = {
      total: 100,
      pageSize: 10,
      page: 1,
      list: Array.from({ length: 100 }, (_, i) => i + 1),
    }
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePagination())
    const [pagination] = result.current
    expect(pagination.total).toBe(Number.POSITIVE_INFINITY)
    expect(pagination.page).toBe(1)
    expect(pagination.pageSize).toBe(10)
  })

  it('should paginate correctly', () => {
    const { result } = renderHook(() => usePagination(options))
    const [pagination] = result.current
    expect(pagination.list).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(pagination.pageCount).toBe(10)
  })

  it('should go to the next page', () => {
    const { result } = renderHook(() => usePagination(options))
    const [, actions] = result.current

    act(() => {
      actions.next()
    })

    const [pagination] = result.current
    expect(pagination.page).toBe(2)
    expect(pagination.list).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
  })

  it('should go to the previous page', () => {
    const { result } = renderHook(() => usePagination(options))
    const [, actions] = result.current

    act(() => {
      actions.next()
      actions.prev()
    })

    const [pagination] = result.current
    expect(pagination.page).toBe(1)
  })

  it('should go to a specific page', () => {
    const { result } = renderHook(() => usePagination(options))
    const [, actions] = result.current

    act(() => {
      actions.go(3)
    })

    const [pagination] = result.current
    expect(pagination.page).toBe(3)
    expect(pagination.list).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30])
  })

  it('should set page size correctly', () => {
    const { result } = renderHook(() => usePagination(options))
    const [, actions] = result.current

    act(() => {
      actions.setPageSize(5)
    })

    const [pagination] = result.current
    expect(pagination.pageSize).toBe(5)
    expect(pagination.pageCount).toBe(20)
    expect(pagination.list).toEqual([1, 2, 3, 4, 5])
  })

  it('should handle edge cases', () => {
    options.total = 0
    options.list = []

    const { result } = renderHook(() => usePagination(options))
    const [pagination] = result.current

    expect(pagination.pageCount).toBe(1)
    expect(pagination.list).toEqual([])
  })

  it('should handle onPageSizeChange', () => {
    const onPageSizeChange = vi.fn()

    const { result } = renderHook(() => usePagination({ ...options, onPageSizeChange }))

    act(() => {
      result.current[1].setPageSize(5)
    })

    expect(onPageSizeChange).toHaveBeenCalledTimes(1)
  })

  it('should handle onPageChange', () => {
    const onPageChange = vi.fn()

    const { result } = renderHook(() => usePagination({ ...options, onPageChange }))

    act(() => {
      result.current[1].next()
    })

    expect(onPageChange).toHaveBeenCalledTimes(1)
  })

  it('should handle onPageCountChange', () => {
    const onPageCountChange = vi.fn()

    const { result } = renderHook(() => usePagination({ ...options, onPageCountChange, pageSize: 10 }))

    act(() => {
      result.current[1].setPageSize(5)
    })

    expect(onPageCountChange).toHaveBeenCalledTimes(1)
  })
})
