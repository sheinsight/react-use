import { useRef } from 'react'

import {
  defaultBreakpoints,
  useBreakpoints,
  useCountdown,
  useFullscreen,
  useInfiniteScroll,
  useNetwork,
  useSafeState,
  useTextSelection,
} from '@shined/react-use'

export const PartThree = () => {
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const infiniteRef = useRef<HTMLDivElement>(null)
  const [list, setList] = useSafeState([1])
  const netState = useNetwork()
  const s = useTextSelection()
  const { breakpoints, isGreater, currents: current } = useBreakpoints(defaultBreakpoints)
  const { isLoading } = useInfiniteScroll(infiniteRef, async () =>
    setList([...list, ...Array.from({ length: 20 }, (_, i) => list.length + i)]),
  )

  const infiniteFull = useFullscreen(infiniteRef)
  const fullscreenFull = useFullscreen(fullscreenRef)

  const remains = useCountdown('2050-10-01 20:00:00', {
    interval: 1000,
    controls: true,
  })

  console.log('PartThree render at', Date.now())

  return (
    <div>
      <pre>
        {JSON.stringify(breakpoints)} {isGreater('lg') ? '1' : '0'} {current.join(',')}
      </pre>
      <button type="button" onClick={fullscreenFull.toggle}>
        {fullscreenFull.isFullscreen ? 'exit' : 'enter'} fullscreenFull fullscreen
      </button>

      <pre>{remains.ms}</pre>
      <pre>{JSON.stringify(s, null, 2)}</pre>
      <pre>{JSON.stringify(s.ranges[0], null, 2)}</pre>
      <pre>{JSON.stringify(netState, null, 2)}</pre>
      <div ref={fullscreenRef} className="w-60 h-60 bg-red">
        <div>{infiniteFull.isFullscreen ? 'infiniteFull true' : 'infiniteFull false'}</div>
        <div>
          {infiniteFull.isSelfFullscreen ? 'infiniteFull isSelfFullscreen true' : 'infiniteFull isSelfFullscreen false'}
        </div>
        <button type="button" onClick={infiniteFull.toggle}>
          {infiniteFull.isFullscreen ? 'exit' : 'enter'} infiniteFull fullscreen
        </button>
      </div>
      <div className="w-60 h-60 overflow-scroll" ref={infiniteRef}>
        <div>{fullscreenFull.isFullscreen ? 'fullscreenFull true' : 'fullscreenFull false'}</div>
        <div>
          {fullscreenFull.isSelfFullscreen
            ? 'fullscreenFull isSelfFullscreen true'
            : 'fullscreenFull isSelfFullscreen false'}
        </div>
        <button type="button" onClick={infiniteFull.toggle}>
          {infiniteFull.isFullscreen ? 'exit' : 'enter'} infiniteFull fullscreen
        </button>
        <div className="w-60 flex flex-col gap-2">
          {list.map((e, idx) => (
            <div className="h-16 bg-lime-7 overflow-hidden" key={e.toString()}>
              {e}
              {Array.from({ length: 100 })
                .fill(0)
                .map((_, idx) => idx)
                .map((e) => (
                  <div key={e}>{e}</div>
                ))}
            </div>
          ))}
          {isLoading ? 'loading' : `done with ${list.length} items fetched`}
        </div>
      </div>
    </div>
  )
}
