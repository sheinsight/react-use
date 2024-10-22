import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePagingList } from './index'

describe('usePagingList', () => {
  let fetcherMock: Mock

  beforeEach(() => {
    fetcherMock = vi.fn().mockResolvedValue([])
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      usePagingList({
        fetcher: fetcherMock,
        query: { immediate: false },
      }),
    )

    expect(result.current.loading).toBe(false)
    expect(result.current.list).toEqual([])
    expect(result.current.form).toBeDefined()
    expect(result.current.refresh).toBeInstanceOf(Function)
    expect(result.current.selection).toBeDefined()
    expect(result.current.pagination).toBeDefined()
  })

  it('should call fetcher on form submit', async () => {
    const { result } = renderHook(() => usePagingList({ fetcher: fetcherMock }))

    await act(async () => {
      result.current.form.submit()
    })

    expect(fetcherMock).toHaveBeenCalled()
  })

  it('should trigger new query on form change', async () => {
    const { result } = renderHook(() => usePagingList({ fetcher: fetcherMock, immediateQueryKeys: ['key'] }))

    await act(async () => {
      result.current.form.setValue({ key: 'newValue' })
    })

    expect(fetcherMock).toHaveBeenCalled()
  })

  it('should refresh the query', async () => {
    const { result } = renderHook(() => usePagingList({ fetcher: fetcherMock }))

    act(() => {
      result.current.refresh()
    })

    expect(fetcherMock).toHaveBeenCalled()
  })

  it('should update selection state', () => {
    const { result } = renderHook(() => usePagingList({ fetcher: fetcherMock }))

    act(() => {
      result.current.selection.setSelected([1, 2, 3])
    })

    expect(result.current.selection.selected).toEqual([1, 2, 3])
  })

  it('should handle loading state', async () => {
    fetcherMock.mockResolvedValue([])

    const { result } = renderHook(() => usePagingList({ fetcher: fetcherMock }))

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await fetcherMock()
    })

    expect(result.current.loading).toBe(false)
  })

  it('should handle pageSize change', async () => {
    const onPageSizeChange = vi.fn()

    const { result } = renderHook(() =>
      usePagingList({
        fetcher: fetcherMock,
        pagination: {
          pageSize: 10,
          onPageSizeChange,
        },
      }),
    )

    expect(fetcherMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.pagination.setPageSize(5)
    })

    expect(fetcherMock).toHaveBeenCalledTimes(2)
    expect(onPageSizeChange).toHaveBeenCalledTimes(1)
  })
})
