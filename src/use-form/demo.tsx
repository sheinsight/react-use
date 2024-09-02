import { Button, Card, Input, OTP, Select, Toaster, Zone, wait as mockFetch, toast } from '@/components'
import { useForm } from '@shined/react-use'

const genders = ['Boy', 'Girl'] as const
const nations = ['China', 'United States', 'United Kingdom'] as const
const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Violet'] as const

interface FormState {
  name: string
  gender: (typeof genders)[number]
  color: (typeof colors)[number][]
  nation: (typeof nations)[number]
  age?: string
  confirm?: boolean
}

export function App() {
  const form = useForm({
    initialValue: {
      name: '',
      age: '20',
      gender: genders[1],
      color: [colors[1]],
      nation: nations[1],
      confirm: true,
    } as FormState,
    onSubmit: async (form) => {
      toast.loading('Submitting...', { id: 'submit' })
      console.log('submit', form)
      await mockFetch()
      toast.success(`Hello, ${form.name ?? 'Unknown User'}!`, { id: 'submit' })
    },
    onChange: (form) => console.log('form change', form),
    onReset: () => console.log('reset done'),
  })

  return (
    <Card className="py-8">
      <form {...form.nativeProps}>
        <Zone>
          <Zone>
            <label title="Name" className="flex gap-2 items-center">
              <span className="text-right inline-block w-80px">Name:</span>
              <Input placeholder="Input your name" name="name" required />
            </label>
          </Zone>
          <Zone>
            <span className="text-right inline-block w-80px">Gender:</span>
            {genders.map((gender) => (
              <label key={gender}>
                <input name="gender" type="radio" required value={gender} />
                <span className="ml-1">{gender}</span>
              </label>
            ))}
          </Zone>
          <Zone>
            <label title="Age" className="flex gap-2 items-center">
              <span className="text-right inline-block w-80px">Age:</span>
              <Input placeholder="Input your age" name="age" type="number" />
            </label>
          </Zone>
          <Zone>
            <span className="text-right inline-block w-80px">Color:</span>
            {colors.map((color) => (
              <label key={color}>
                <input name="color" type="checkbox" value={color} />
                <span className="ml-1">{color}</span>
              </label>
            ))}
          </Zone>
          <Zone>
            <label title="Nation" className="flex gap-2 items-center">
              <span className="text-right inline-block w-80px">Nation:</span>
              <Select name="nation">
                {nations.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </Select>
            </label>
          </Zone>
          <Zone>
            <label title="Confirm" className="flex gap-2 items-center">
              <span className="text-right inline-block w-80px" />
              <label>
                <input required name="confirm" type="checkbox" />
                <span>
                  <span className="ml-1">I have read and agree to the </span>
                  <a href="#term" className="text-blue-6 underline">
                    Terms of Service
                  </a>
                  .
                </span>
              </label>
            </label>
          </Zone>
          <Zone className="pl-88px">
            <Button disabled={form.submitting} type="submit">
              Submit
            </Button>
            <Button variant="secondary" type="reset">
              Reset
            </Button>
          </Zone>
        </Zone>
      </form>

      <Zone className="mt-8">
        <Button
          onClick={() => {
            form.setValue({
              name: OTP(),
              gender: genders[1],
              age: '18',
              color: [colors[2], colors[4]],
              nation: nations[1],
              confirm: true,
            })
          }}
        >
          Set form
        </Button>
        <Button onClick={() => form.setFieldValue('name', OTP())}>Set field</Button>
        <Button onClick={form.reset}>Reset outside</Button>
        <Button onClick={form.submit}>Submit outside</Button>
      </Zone>
      <Toaster />
    </Card>
  )
}
