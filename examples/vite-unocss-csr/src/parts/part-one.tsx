import { useRef, useState } from 'react'

import {
  useActiveElement,
  useDraggable,
  useDropZone,
  useElementBounding,
  useElementSize,
  useElementVisibility,
  useFocus,
  useHover,
  useLoremIpsum,
  useMouse,
  useMouseInElement,
  useMousePressed,
  useScroll,
  useWindowScroll,
} from '@shined/react-use'

export function PartOne() {
  const hoverRef = useRef<HTMLDivElement>(null)
  const isHovered = useHover(hoverRef)

  const dropRef = useRef<HTMLDivElement>(null)
  const textArea = useRef<HTMLTextAreaElement>(null)
  const draggableRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef<HTMLInputElement>(null)
  const mouseInElRef = useRef<HTMLPreElement>(null)
  const mousePressedRef = useRef<HTMLPreElement>(null)

  const [count, setCount] = useState(0)

  const el = useActiveElement()

  const { scrollTo, scrollToBottom, ...windowScrollRest } = useWindowScroll({ behavior: 'smooth' })
  const scroll = useScroll(scrollRef, { behavior: 'smooth' })
  const visible = useElementVisibility(scrollRef)
  const bounding = useElementBounding(textArea)

  const mousePressed = useMousePressed(mousePressedRef)
  const { x, y, sourceType } = useMouse()
  const { height, width } = useElementSize(textArea)
  const { isOverDropZone, files } = useDropZone(dropRef)
  const { stop: stopMouseInElement, ...rest } = useMouseInElement(mouseInElRef)

  const { isDragging, style, position } = useDraggable(draggableRef, {
    initialValue: { x: 120, y: 120 },
    preventDefault: true,
  })

  const lorem = useLoremIpsum()

  return (
    <div className="bg-lime-6 p-4 rounded">
      <div className="bg-blue-3 p-2 my-1 rounded">{lorem}</div>
      <pre ref={mousePressedRef} className="bg-blue-3 p-2 rounded">
        {JSON.stringify(mousePressed)}
      </pre>
      <button type="button" onClick={scrollToBottom}>
        scrollToBottom
      </button>
      <button type="button" onClick={() => scrollTo({ y: 160 })}>
        scroll to 160
      </button>
      <pre>{JSON.stringify(windowScrollRest)}</pre>
      <pre ref={mouseInElRef} className="bg-orange-3 p-2 rounded">
        {JSON.stringify(rest, null, 2)}
      </pre>
      <textarea
        readOnly
        ref={textArea}
        value={`height:${height} width:${width}\nbounding:${JSON.stringify(bounding, null, 2)}`}
      />
      <button type="button" onClick={stop}>
        stop observe size
      </button>
      <div ref={hoverRef} className="bg-gray-6 p-4 rounded">
        {isHovered ? 'Nice Try!' : 'Hover me'}
      </div>
      <pre>
        Mouse: ({Math.round(x)}, {Math.round(y)}), type: {sourceType}
      </pre>
      <h1 className="text-amber-3">React + TS + Vite + UnoCSS</h1>
      <p>Happy coding!</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        count is {count}
      </button>
      visible: {visible.toString()}
      <div className="mt-2 w-80 h-32 p-4 rounded bg-sky" ref={dropRef}>
        {isOverDropZone ? 'release it' : 'Drop something here!'}
        {files?.map((e) => e.name)}
      </div>
      <div className="flex justify-between w-100">
        <div ref={scrollRef} className="mt-2 w-32 h-32 p-2 rounded bg-blue overflow-scroll">
          <pre className="h-48 w-48 bg-red" />
        </div>
        <pre className="h-102 w-48 bg-yellow-6">{JSON.stringify(scroll, null, 2)}</pre>
      </div>
      <div ref={draggableRef} style={style} className="hover:cursor-grabbing w-80 h-32 p-4 rounded bg-orange">
        <h2 className="my-2">{isDragging ? 'dragging' : 'drag me!'}</h2>
        <div>
          left: {Math.round(position.x)}px, top: {Math.round(position.y)}px
        </div>
      </div>
    </div>
  )
}
