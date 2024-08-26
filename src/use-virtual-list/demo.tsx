import { Button, Card, Zone, cn } from '@/components'
import { useCreation, useVirtualList } from '@shined/react-use'
import { useRef } from 'react'

const containerBaseCls = 'w-full md:w-640px overflow-auto border-2 border-solid border-primary rounded'

const itemBaseCls =
  'border-0 border-dashed border-amber last:border-0 transition-all even:bg-amber/4 hover:bg-primary/16!'

export function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const data = useCreation(() => Array.from({ length: 100_000 }, (_, i) => i))

  const [list, actions] = useVirtualList(data, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 60,
  })

  function getSize(index: number) {
    return index % 3 === 0 ? 120 : index % 3 === 1 ? 160 : 200
  }

  const [_list, _actions] = useVirtualList(data, {
    containerTarget: '#scroll-container-h',
    wrapperTarget: '#scroll-wrapper-h',
    itemWidth: (index, item) => getSize(index),
  })

  return (
    <Card>
      <Zone>
        <h3 className="font-medium text-xl">Fixed Size Virtual List (Vertical, 100,000 Count)</h3>

        <div ref={containerRef} className={cn(containerBaseCls, 'h-300px')}>
          <div ref={wrapperRef}>
            {list.map((item) => (
              <div
                key={item.index}
                className={cn(itemBaseCls, 'grid place-content-center text-center h-60px border-b')}
              >
                Index {(+item.data).toLocaleString()}
              </div>
            ))}
          </div>
        </div>

        <Zone>
          <Button onClick={() => actions.scrollToStart()}>Scroll to Start</Button>
          <Button onClick={() => actions.scrollTo(11451)}>Scroll to index 11451</Button>
          <Button onClick={() => actions.scrollTo(14191)}>Scroll to index 14191</Button>
          <Button onClick={() => actions.scrollToEnd()}>Scroll to End</Button>
        </Zone>
      </Zone>

      <Zone className="mt-4">
        <h3 className="font-medium text-xl">Dynamic Size Virtual List (Horizontal, 100,000 Count)</h3>

        <div id="scroll-container-h" className={cn(containerBaseCls, 'h-100px')}>
          <div id="scroll-wrapper-h" className="inline-flex h-full">
            {_list.map((item) => (
              <div
                key={item.data.toString()}
                className={cn(
                  itemBaseCls,
                  item.index % 3 === 0 ? 'w-120px' : item.index % 3 === 1 ? 'w-160px' : 'w-200px',
                  'flex flex-col items-center justify-center border-r',
                )}
              >
                <div>Index {(+item.data).toLocaleString()}</div>
                <div>({getSize(item.index)}px)</div>
              </div>
            ))}
          </div>
        </div>
        <Zone>
          <Button onClick={() => _actions.scrollToStart()}>Scroll to Start</Button>
          <Button onClick={() => _actions.scrollTo(11451)}>Scroll to Index 11451</Button>
          <Button onClick={() => _actions.scrollTo(14191)}>Scroll to Index 14191</Button>
          <Button onClick={() => _actions.scrollToEnd()}>Scroll to End</Button>
        </Zone>
      </Zone>
    </Card>
  )
}
