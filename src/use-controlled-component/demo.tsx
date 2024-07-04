import { Button, Card, Input, Zone } from '@/components'
import { useControlledComponent, useUnmount } from '@shined/react-use'
import { Toaster, toast } from 'react-hot-toast'

// biome-ignore format: no wrap
interface Item {
  label: string
  value: string
}

const items: Item[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
]

export function App() {
  const select = useControlledComponent<Item>(items.at(0))
  const input = useControlledComponent('React is awesome!')

  useUnmount(() => toast.remove())

  return (
    <Card>
      <Zone>
        <Input {...input.props} />
        <Button onClick={() => toast.success(input.value)}>Toast input value</Button>
      </Zone>
      <Zone>
        <MySelect items={items} {...select.props} />
        <Button onClick={() => toast.success(`You select ${select.value.label}!`)}>Toast selected item</Button>
      </Zone>
      <Toaster />
    </Card>
  )
}

// biome-ignore format: no wrap
function MySelect<T>(props: { items: Item[]; value: Item; onChange: (value: Item) => void }) {
  return (
    <div className='flex gap-2 items-center'>
      {props.items.map(item => {
        const color = props.value === item ? 'bg-amber-5/80 hover:bg-amber-5' : 'bg-primary/80 hover:bg-primary'
        return (
          <div
            className={`text-white cursor-pointer py-1 px-3 rounded transition-all ${color}`}
            key={item.value}
            onClick={() => props.onChange(item)}
            onKeyDown={() => props.onChange(item)}
          >
            {item.label}
          </div>
        )
      })}
    </div>
  )
}
