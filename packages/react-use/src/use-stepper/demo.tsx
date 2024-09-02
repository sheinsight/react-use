import { Button, Card, KeyValue, LabelInput, Zone } from '@/components'
import { useSetState, useStepper } from '@shined/react-use'

export function App() {
  const [form, setForm] = useSetState({ name: '', email: '', address: '', payment: '' })

  const steps = [
    { key: 'info', title: 'Personal Information', condition: () => form.name && form.email },
    { key: 'address', title: 'Address', condition: () => form.address },
    { key: 'payment', title: 'Payment', condition: () => form.payment },
    { key: 'confirm', title: 'Confirmation', condition: () => true },
  ]

  const step = useStepper(steps)

  return (
    <Card>
      <Zone border="primary" row={false}>
        <h2>{step.current.title}</h2>
        {step.current.key === 'info' && (
          <>
            <LabelInput label="Name" value={form.name} onChange={(e) => setForm({ name: e.target.value })} />
            <LabelInput label="Email" value={form.email} onChange={(e) => setForm({ email: e.target.value })} />
          </>
        )}
        {step.current.key === 'address' && (
          <LabelInput label="Address" value={form.address} onChange={(e) => setForm({ address: e.target.value })} />
        )}
        {step.current.key === 'payment' && (
          <LabelInput label="Payment" value={form.payment} onChange={(e) => setForm({ payment: e.target.value })} />
        )}
        {step.current.key === 'confirm' && (
          <>
            <KeyValue label="Name" value={form.name} />
            <KeyValue label="Email" value={form.email} />
            <KeyValue label="Address" value={form.address} />
            <KeyValue label="Payment" value={form.payment} />
          </>
        )}
        <Zone>
          {!step.isFirst && (
            <Button onClick={step.goToPrevious} variant="secondary">
              Back
            </Button>
          )}

          <Button onClick={!step.isLast ? step.goToNext : () => alert('Done!')} disabled={!step.current.condition()}>
            {step.isLast ? 'Confirm' : 'Next'}
          </Button>
        </Zone>
        {step.next?.title && <span className="text-gray">Next: {step.next.title}</span>}
      </Zone>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </Card>
  )
}
