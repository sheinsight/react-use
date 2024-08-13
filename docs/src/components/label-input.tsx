import { Input } from './input'

export function LabelInput(
  props: Parameters<typeof Input>[0] & {
    label?: string
    labelWidth?: string
  },
) {
  return (
    <div className="flex gap-2 items-center">
      <span style={{ width: props.labelWidth }}>{props.label}: </span>
      <Input {...props} />
    </div>
  )
}
