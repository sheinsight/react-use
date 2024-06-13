import { Button, Card, KeyValue, Zone } from '@/components'
import { useMultiSelect } from '@shined/use'

// prettier-ignore
const list = [
  'grape 🍇',
  'watermelon 🍉',
  'orange 🍊',
  'banana 🍌',
  'pineapple 🍍',
  'mango 🥭',
  'apple 🍎',
  'pear 🍐',
  'peach 🍑',
  'cherry 🍒',
  'strawberry 🍓',
  'blueberry 🫐',
  'kiwifruit 🥝',
  'coconut 🥥',
]

export function App() {
  const multiSelect = useMultiSelect(list)

  return (
    <Card>
      <h2>Choose your favorite fruits</h2>
      <div className="flex items-center gap-x-6 flex-wrap">
        {list.map((item) => {
          const isSelected = multiSelect.isItemSelected(item)
          return (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" checked={isSelected} onChange={() => multiSelect.toggle(item)} />
              <span>{item}</span>
            </label>
          )
        })}
      </div>
      <Zone>
        <KeyValue label="All selected" value={multiSelect.isAllSelected} />
        <KeyValue label="Partially selected" value={multiSelect.isPartiallySelected} />
        <KeyValue label="None selected" value={multiSelect.isNoneSelected} />
        <KeyValue label="Is Melon selected" value={multiSelect.isItemSelected('watermelon 🍉')} />
      </Zone>
      <Zone>
        <Button onClick={multiSelect.selectAll}>Select all</Button>
        <Button onClick={multiSelect.unSelectAll}>Unselect all</Button>
        <Button onClick={multiSelect.toggleAll}>Toggle all</Button>
        <Button onClick={() => multiSelect.select('watermelon 🍉')}>Select melon</Button>
        <Button onClick={() => multiSelect.unSelect('watermelon 🍉')}>Unselect melon</Button>
      </Zone>
      <Zone border="primary">
        <KeyValue label="Selected" value={multiSelect.selected.join(', ')} />
      </Zone>
    </Card>
  )
}
