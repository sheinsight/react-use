import { Button, Card, Zone } from '@/components'
import { useDeviceList, useUserMedia } from '@shined/react-use'
import { useRef } from 'react'

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const { videoInputs } = useDeviceList({ requestPermissions: true })

  const media = useUserMedia({
    onStart: (stream) => {
      if (!videoRef.current) return
      videoRef.current.srcObject = stream
    },
    onStop: () => {
      if (!videoRef.current) return
      videoRef.current.srcObject = null
    },
    constraints: {
      video: {
        deviceId: videoInputs[0]?.deviceId,
      },
    },
  })

  return (
    <Card>
      <Zone center>
        <video ref={videoRef} muted autoPlay controls className="h-160px md:h-100 w-auto" />
      </Zone>
      <Zone center>
        <Button onClick={() => media.resume()}>Resume</Button>
        <Button onClick={() => media.pause()}>Pause</Button>
      </Zone>
    </Card>
  )
}
