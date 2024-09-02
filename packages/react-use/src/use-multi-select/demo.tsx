import { Button, Card, KeyValue, Zone } from '@/components'
import { useMultiSelect } from '@shined/react-use'

// biome-ignore format: for demo
const list = [ 'grape 🍇', 'watermelon 🍉', 'orange 🍊', 'banana 🍌', 'pineapple 🍍', 'mango 🥭', 'apple 🍎', 'pear 🍐', 'peach 🍑', 'cherry 🍒', 'strawberry 🍓', 'blueberry 🫐', 'kiwifruit 🥝', 'coconut 🥥']

export function App() {
  const [state, actions] = useMultiSelect(list)

  return (
    <Card>
      <h2>Choose your favorite fruits</h2>
      <div className="flex items-center gap-x-6 flex-wrap">
        {list.map((item) => {
          const isSelected = actions.isItemSelected(item)
          return (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" checked={isSelected} onChange={() => actions.toggle(item)} />
              <span>{item}</span>
            </label>
          )
        })}
      </div>
      <Zone>
        <KeyValue label="All selected" value={state.isAllSelected} />
        <KeyValue label="Partially selected" value={state.isPartiallySelected} />
        <KeyValue label="None selected" value={state.isNoneSelected} />
        <KeyValue label="Is Melon selected" value={actions.isItemSelected('watermelon 🍉')} />
      </Zone>
      <Zone>
        <Button onClick={actions.selectAll}>Select all</Button>
        <Button onClick={actions.unSelectAll}>Unselect all</Button>
        <Button onClick={actions.toggleAll}>Toggle all</Button>
        <Button onClick={() => actions.select('watermelon 🍉')}>Select melon</Button>
        <Button onClick={() => actions.unSelect('watermelon 🍉')}>Unselect melon</Button>
      </Zone>
      <Zone border="primary">
        <KeyValue label="Selected" value={state.selected.join(', ')} />
      </Zone>
    </Card>
  )
}
