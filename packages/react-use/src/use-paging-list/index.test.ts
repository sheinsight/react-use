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

  it('should update selection state', async () => {
    const { result } = renderHook(() => usePagingList({ fetcher: fetcherMock }))

    await act(async () => {}) // wait for initial fetch

    act(() => {
      result.current.selection.setSelected([1, 2, 3])
    })

    expect(result.current.selection.selected).toEqual([1, 2, 3])
  })

  it('should handle loading state', async () => {
    fetcherMock.mockResolvedValue([])

    const { result } = renderHook(() => usePagingList({ fetcher: fetcherMock }))

    expect(result.current.loading).toBe(true)

    await act(async () => {}) // wait for initial fetch

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

    await act(async () => {}) // wait for initial fetch

    expect(fetcherMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.pagination.setPageSize(5)
    })

    expect(fetcherMock).toHaveBeenCalledTimes(2)
    expect(onPageSizeChange).toHaveBeenCalledTimes(1)
  })

  it('should handle form reset', async () => {
    const { result } = renderHook(() =>
      usePagingList({ fetcher: fetcherMock, form: { initialValue: { name: 'initial' } } }),
    )

    await act(async () => {}) // wait for initial fetch

    await act(async () => {
      result.current.form.setValue({ name: 'value' })
    })

    expect(result.current.form.value).toEqual({ name: 'value' })
    expect(fetcherMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.form.reset()
    })

    expect(result.current.form.value).toEqual({ name: 'initial' })
    expect(fetcherMock).toHaveBeenCalledTimes(2)
  })

  it('should handle page change', async () => {
    const { result } = renderHook(() =>
      usePagingList({
        fetcher: async (params) => {
          const res = await fetcherMock()
          params.setTotal(100)
          return res
        },
        pagination: {
          pageSize: 20,
        },
      }),
    )

    await act(async () => {}) // wait for initial fetch

    await act(async () => {
      result.current.pagination.go(2)
    })

    expect(fetcherMock).toHaveBeenCalledTimes(2)
  })

  it('should reserve previous data on page change', async () => {
    fetcherMock.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }])

    const { result } = renderHook(() =>
      usePagingList({
        fetcher: async (params) => {
          const res = await fetcherMock()
          params.setTotal(100)
          return res
        },
        pagination: {
          pageSize: 20,
        },
      }),
    )

    await act(async () => {}) // wait for initial fetch

    act(() => {
      result.current.selection.select({ id: 1 })
      result.current.selection.select({ id: 2 })
    })

    expect(result.current.selection.selected).toEqual([{ id: 1 }, { id: 2 }])

    fetcherMock.mockResolvedValue([{ id: 4 }, { id: 5 }, { id: 6 }])

    act(() => {
      result.current.pagination.next()
    })

    act(() => {
      result.current.selection.select({ id: 4 })
    })

    expect(result.current.selection.selected).toEqual([{ id: 1 }, { id: 2 }, { id: 4 }])

    fetcherMock.mockResolvedValue([{ id: 4 }, { id: 5 }, { id: 6 }])

    act(() => {
      result.current.pagination.prev()
    })

    expect(result.current.selection.selected).toEqual([{ id: 1 }, { id: 2 }, { id: 4 }])
  })

  it('should handle onReset', async () => {
    const onReset = vi.fn()

    const { result } = renderHook(() =>
      usePagingList({
        fetcher: fetcherMock,
        form: { onReset },
      }),
    )

    await act(async () => {}) // wait for initial fetch

    await act(async () => {
      result.current.form.reset()
    })

    expect(onReset).toHaveBeenCalled()
  })

  it('should handle onSubmit', async () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() =>
      usePagingList({
        fetcher: fetcherMock,
        form: { onSubmit },
      }),
    )

    await act(async () => {}) // wait for initial fetch

    await act(async () => {
      result.current.form.submit()
    })

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should handle onChange', async () => {
    const onChange = vi.fn()

    const { result } = renderHook(() =>
      usePagingList({
        fetcher: fetcherMock,
        form: { onChange, initialValue: { name: 'initial' } },
      }),
    )

    await act(async () => {}) // wait for initial fetch

    await act(async () => {
      result.current.form.handleChange({ name: 'newValue' })
    })

    expect(onChange).toHaveBeenCalled()
  })

  it('should handle onPageChange', async () => {
    const onPageChange = vi.fn()

    const { result } = renderHook(() =>
      usePagingList({
        fetcher: async (params) => {
          const res = await fetcherMock()
          params.setTotal(100)
          return res
        },
        pagination: { onPageChange },
      }),
    )

    await act(async () => {}) // wait for initial fetch

    expect(fetcherMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.pagination.go(2)
    })

    await act(async () => {})

    expect(fetcherMock).toHaveBeenCalledTimes(2)

    expect(onPageChange).toHaveBeenCalledTimes(1)
  })

  it('should handle onBefore', async () => {
    const onBefore = vi.fn()

    const { result } = renderHook(() =>
      usePagingList({
        fetcher: fetcherMock,
        query: { onBefore },
      }),
    )

    await act(async () => {}) // wait for initial fetch

    expect(onBefore).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.form.submit()
    })

    expect(onBefore).toHaveBeenCalledTimes(2)
  })

  it('should handle onSuccess', async () => {
    const onSuccess = vi.fn()

    const { result } = renderHook(() =>
      usePagingList({
        fetcher: fetcherMock,
        query: { onSuccess },
      }),
    )

    await act(async () => {}) // wait for initial fetch

    expect(onSuccess).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.form.submit()
    })

    expect(onSuccess).toHaveBeenCalledTimes(2)
  })
})
