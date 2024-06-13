import { useRef } from 'react'

import {
  useClickOutside,
  useControlledComponent,
  useCssVar,
  useFavicon,
  useGeolocation,
  useLastUpdated,
  useSpringValue,
  useTimeAgo,
  useTitle,
} from '@shined/use'

export const PartFour = () => {
  const divRef = useRef<HTMLDivElement | null>(null)
  const [favicon, favActions] = useFavicon()
  const { resume, pause, ...rest } = useGeolocation({ immediate: false })

  const [variable, setVariable] = useCssVar(
    '--color',
    {
      defaultValue: '#EEEEEE',
    },
    divRef,
  )

  // const interval = useInterval(1000, { controls: true })

  useClickOutside(divRef, () => console.log('yolo!!!'))

  // const idle = useUserIdle(3000)
  // const { fps } = useFps()

  const { value, ...springControls } = useSpringValue(1, 2, {
    damping: 1,
  })

  const updatedAt = useLastUpdated(value)
  const com = useControlledComponent()

  const ago = useTimeAgo(Date.now() + (+com.value) ** 3)

  console.log('PartFour render at', Date.now(), rest.coords)

  return (
    <div>
      <pre>
        updatedAt: {updatedAt}, springValue: {value}
      </pre>
      <input {...com.props} type="range" min="-3800" max="3800" />
      <pre>diff ms: {(+com.value) ** 3}</pre>
      <pre>ago: {ago}</pre>
      <button type="button" onClick={() => springControls.pause(true)}>
        pause
      </button>
      <button type="button" onClick={() => springControls.resume(true)}>
        resume
      </button>
      <button type="button" onClick={springControls.restart}>
        restart
      </button>
      <div
        className="fixed will-change-auto bg-red left-20 top-20 w-20 h-20 transition"
        style={{
          scale: `${value} ${value}`,
          top: `${value * 100}px`,
        }}
      >
        123
      </div>
      {/* <div>interval: {interval.count}</div> */}
      {/* <pre>{JSON.stringify(idle, null, 2)}</pre> */}
      <pre>Geolocation: {JSON.stringify(rest, null, 2)}</pre>
      <button type="button" onClick={() => resume(true)}>
        resume geo
      </button>
      {/* <div>FPS: {fps}</div> */}
      <div className="w-80 bg-lime" ref={divRef}>
        <div style={{ color: 'var(--color)' }}>{variable}</div>
        <button
          type="button"
          onClick={() => {
            setVariable(`#${Math.random().toString(16).toUpperCase().slice(2, 8)}`)
          }}
        >
          change css var
        </button>

        <input
          type="text"
          onChange={(e) => {
            location.hash = e.target.value
          }}
        />
        <button
          type="button"
          onClick={() => {
            location.hash = '112'
          }}
        >
          change hash
        </button>
      </div>
      <div>
        <div>{favicon}</div>
      </div>
      <div>
        <button type="button" onClick={() => favActions.setEmojiFavicon('😂')}>
          setEmojiFavicon
        </button>
        <button type="button" onClick={() => favActions.setFavicon('https://b.viki.moe/dimo.png')}>
          setFavicon
        </button>
        <button type="button" onClick={favActions.setPreviousFavicon}>
          setPreviousFavicon
        </button>
      </div>
    </div>
  )
}
