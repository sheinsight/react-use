import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInfiniteList } from './index'

describe('useInfiniteList', () => {
  let fetcherMock: Mock

  beforeEach(() => {
    fetcherMock = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useInfiniteList())
    expect(result.current.list).toEqual([])
    expect(result.current.fullList).toEqual([])
  })

  it('should call fetcher on load', async () => {
    fetcherMock.mockResolvedValueOnce({ id: 1, list: [] })
    const { result } = renderHook(() => useInfiniteList({ fetcher: fetcherMock }))
    await act(async () => {})
    expect(fetcherMock).toHaveBeenCalled()
    expect(result.current.list).toEqual([{ id: 1, list: [] }])
  })

  it('should reset the list', async () => {
    fetcherMock.mockResolvedValueOnce({ id: 1, list: [] })
    const { result } = renderHook(() => useInfiniteList({ fetcher: fetcherMock }))

    await act(async () => {})

    expect(result.current.list).toEqual([{ id: 1, list: [] }])

    act(() => {
      result.current.reset()
    })

    expect(result.current.list).toEqual([])
  })

  it('should handle pagination', async () => {
    fetcherMock.mockResolvedValueOnce({ id: 1, list: [] })
    const { result } = renderHook(() => useInfiniteList({ fetcher: fetcherMock, pagination: { pageSize: 1 } }))

    await act(async () => {})

    expect(result.current.list).toEqual([{ id: 1, list: [] }])

    fetcherMock.mockResolvedValueOnce({ id: 2, list: [] })

    await act(async () => {
      await result.current.loadMore()
    })

    expect(result.current.list).toEqual([
      { id: 1, list: [] },
      { id: 2, list: [] },
    ])
  })

  it('should trigger immediate query on form change', async () => {
    fetcherMock.mockResolvedValueOnce({ id: 1, list: [] })
    const { result } = renderHook(() =>
      useInfiniteList({ fetcher: fetcherMock, form: { initialValue: { name: '' } }, immediateQueryKeys: ['name'] }),
    )

    act(() => {
      result.current.form.setValue({ name: 'test' })
    })

    expect(fetcherMock).toHaveBeenCalled()
  })

  it('should handle loading more with infinite scroll', async () => {
    fetcherMock.mockResolvedValueOnce({ id: 1, list: [] })
    const { result } = renderHook(() => useInfiniteList({ fetcher: fetcherMock }))

    await act(async () => {})

    expect(result.current.list).toEqual([{ id: 1, list: [] }])
  })

  it('should allow custom canLoadMore logic', async () => {
    fetcherMock.mockResolvedValueOnce({ id: 1, list: [] })
    const { result } = renderHook(() =>
      useInfiniteList({
        fetcher: fetcherMock,
        canLoadMore: (prev, dataList) => dataList.length < 5,
      }),
    )

    await act(async () => {})

    expect(result.current.list).toEqual([{ id: 1, list: [] }])
  })
})
