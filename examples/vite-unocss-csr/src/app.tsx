// import { PartSix } from './parts/part-six'
// import { PartFive } from './parts/part-five'
// import { PartFour } from './parts/part-four'
// import { PartOne } from './parts/part-one'
// import { PartThree } from './parts/part-three'
// import { PartTwo } from './parts/part-two'
// import { Playground } from './playground'
import { useMount } from '@shined/react-use'

export function App() {
  useMount(() => {})

  return (
    <div className="min-h-screen w-screen flex justify-center">
      <div className="flex flex-col gap-2 w-800px">
        {/* <Playground /> */}
        {/* <PartSix /> */}
        {/* <PartFive /> */}
        {/* <PartFour /> */}
        {/* <PartThree /> */}
        {/* <PartTwo /> */}
        {/* <PartOne /> */}
      </div>
    </div>
  )
}
