import { useRef } from 'react'

import {
  useAsyncUpdateEffect,
  useBeforeUnload,
  useBluetooth,
  useClickOutside,
  useClipboard,
  useCountdown,
  useCounter,
  useDeviceList,
  useEyeDropper,
  usePagination,
  useParallax,
  useSafeState,
  useTargetElement,
  useToggle,
  useUserMedia,
} from '@shined/react-use'

export const Playground = () => {
  const [showChild, toggle] = useToggle(true)
  const ref = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLButtonElement>(null)

  const bluetooth = useBluetooth({ filters: [{ namePrefix: 'Viki' }] })

  useClickOutside(ref, (e) => console.log('outside'), {
    ignore: [ref2],
  })

  const [date, setDate] = useSafeState(0)

  const { ms, pause, resume } = useCountdown(date, {
    interval: 1000,
    controls: true,
    immediate: false,
    onUpdate(ms, seconds) {
      console.log('update', ms, seconds, Date.now())
    },
    onStop() {
      console.log('stop', Date.now())
    },
  })

  const { elementStyle, containerStyle } = useParallax('#parallax', {})

  const { sRGBHex, open } = useEyeDropper()

  const { text, copied, copy } = useClipboard({ read: true })

  useBeforeUnload((e) => console.log('callback'))

  const pagination = usePagination()

  const { videoInputs } = useDeviceList({ requestPermissions: true })

  const camera = videoInputs[0]

  const media = useUserMedia({
    onStart: (stream) => {
      if (!video.current) return
      video.current.srcObject = stream
    },
    onStop: () => {
      if (!video.current) return
      video.current.srcObject = null
    },
    constraints: {
      video: {
        deviceId: camera?.deviceId,
      },
    },
  })

  const video = useTargetElement<HTMLVideoElement>('#video')

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="inline-block">
            {videoInputs.map((e) => (
              <div key={e.deviceId}>{e.label}</div>
            ))}
          </div>
          <button type="button" onClick={() => media.resume(true)}>
            start
          </button>
          <button type="button" onClick={() => media.pause(true)}>
            stop
          </button>
        </div>
        <div>
          <video id="video" muted autoPlay controls className="h-100 w-auto" />
        </div>
      </div>

      <div className="m-4 flex flex-col gap-2">
        <div className="flex gap2">
          <button type="button" onClick={pagination.prev}>
            prev
          </button>
          <button type="button" onClick={() => pagination.go(1)}>
            1
          </button>
          <button type="button" onClick={() => pagination.go(2)}>
            2
          </button>
          <button type="button" onClick={() => pagination.go(3)}>
            3
          </button>
          <button type="button" onClick={() => pagination.go(4)}>
            4
          </button>
          <button type="button" onClick={pagination.next}>
            next
          </button>
        </div>
        <pre>{JSON.stringify(pagination, null, 2)}</pre>
      </div>
      <div>
        clipboard: {text} {copied ? '✅' : ''}
      </div>

      <button type="button" onClick={() => copy('copied text')}>
        copy
      </button>

      <div>
        <div style={containerStyle()} className="inline-block bg-gray p-4 rounded-2" id="parallax">
          <div style={elementStyle()} className="w-48 h-48 m-20 bg-white rounded-2" />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => open()}>
          open, last color {sRGBHex}
        </button>
      </div>

      {showChild && <Child />}

      <div className="flex gap-2">
        <button type="button" onClick={() => pause(true)}>
          pause
        </button>
        <button type="button" onClick={() => resume(true)}>
          resume
        </button>
        <button type="button" disabled={!(ms === 0)} onClick={() => setDate(Date.now() + 60_000)}>
          {ms === 0 ? '发送' : Math.round(ms / 1000)}
        </button>
        <button type="button" onClick={() => setDate(Date.now() + 3_000)}>
          {ms === 0 ? '发送' : Math.round(ms / 1000)}
        </button>
        <button type="button" onClick={toggle}>
          toggle mount
        </button>
      </div>

      <div className="mt-2 flex gap-2">
        <button type="button">button 1</button>
        <button type="button" ref={ref2}>
          button 2
        </button>
        <button type="button">button 3</button>
      </div>

      <div className="flex gap-2 mt-2">
        <div className="w-20 h-20 bg-purple" ref={ref}>
          purple
          <button type="button">button</button>
        </div>
        <div className="w-20 h-20 bg-red">red</div>
      </div>

      <div className={`w-120 h-80 rounded mb-2 ${bluetooth.isConnected ? 'bg-lime-6' : 'bg-red-5'}`}>
        <pre>{bluetooth.isSupported ? 'bluetooth supported' : 'bluetooth not supported'}</pre>
        <pre>{bluetooth.isConnecting ? 'connecting...' : bluetooth.isConnected ? 'connected' : 'disconnected'}</pre>
        <pre>requested device: {bluetooth.device?.name ?? 'none'}</pre>
        <pre>server device: {bluetooth.server?.device.name ?? 'none'}</pre>
        <button type="button" onClick={bluetooth.requestDevice}>
          requestDevice
        </button>
        <button type="button" onClick={bluetooth.isConnected ? bluetooth.disconnect : bluetooth.connect}>
          {bluetooth.isConnected ? 'disconnect' : 'connect'}
        </button>
      </div>
    </div>
  )
}

const Child = () => {
  const [count, actions] = useCounter(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: for test
  useAsyncUpdateEffect(
    (isCancelled) => {
      console.log('effect start')

      setTimeout(() => {
        if (isCancelled()) return
        console.log('effect end')
      }, 1000)
    },
    [count],
  )

  return (
    <div>
      <div>child {count}</div>
      <button type="button" onClick={() => actions.inc(1)}>
        inc
      </button>
    </div>
  )
}
