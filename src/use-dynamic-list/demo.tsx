import { Button, Card, Input, Zone } from '@/components'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useDynamicList } from '@shined/react-use'

export function App() {
  const [containerRef] = useAutoAnimate()

  const [list, actions] = useDynamicList([
    { name: 'Alice', age: '20' },
    { name: 'Bob', age: '21' },
    { name: 'Charlie', age: '22' },
  ])

  return (
    <Card>
      <Zone>
        <Zone>
          <div ref={containerRef} className="size-full flex flex-col gap-2">
            {list.map((item, idx) => (
              <Zone key={actions.getKey(idx)}>
                <Input
                  className="w-100px"
                  placeholder="name"
                  value={item.name}
                  onChange={(e) => actions.replace(idx, { ...item, name: e.target.value })}
                />
                <Input
                  className="w-100px"
                  placeholder="age"
                  value={item.age}
                  onChange={(e) => actions.replace(idx, { ...item, age: e.target.value })}
                />
                <Button onClick={() => actions.move(idx, idx - 1)}>⬆️</Button>
                <Button onClick={() => actions.move(idx, idx + 1)}>⬇️</Button>
                <Button onClick={() => actions.insert(idx, { name: '', age: '' })}>➕ ⬆️</Button>
                <Button onClick={() => actions.insert(idx + 1, { name: '', age: '' })}>➕ ⬇️</Button>
                <Button onClick={() => actions.remove(idx)}>🗑️</Button>
              </Zone>
            ))}
          </div>
          <Button onClick={() => actions.push({ name: '', age: '' })}>➕ Add new item</Button>
        </Zone>
        <pre>{JSON.stringify(list, null, 2)}</pre>
      </Zone>
    </Card>
  )
}
