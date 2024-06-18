import { Card } from '@/components'
import { useParallax } from '@shined/react-use'

const wrapperCls = 'inline-block bg-amber/12 rounded-2'
const elementCls = 'size-80 m-16 bg-primary/80 rounded-2'
const boxCls = 'size-full grid place-content-center text-center text-8xl text-amber'

export function App() {
  const parallax = useParallax('#el-parallax')

  return (
    <Card>
      <div id="el-parallax" style={parallax.containerStyle()} className={wrapperCls}>
        <div style={parallax.elementStyle()} className={elementCls}>
          <div className={boxCls}>React Hooks</div>
        </div>
      </div>
    </Card>
  )
}
