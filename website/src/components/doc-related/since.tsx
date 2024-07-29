import Interpolate from '@docusaurus/Interpolate'
import { translate } from '@docusaurus/Translate'

interface Props {
  version: string
}

export function Since(props: Props) {
  return (
    <div className="rounded px-4 py-2 bg-primary/12 my-4 flex items-center gap-1">
      <span className="i-mdi-clock-outline" />
      <div>
        <Interpolate
          values={{
            version: <span className="text-primary font-bold">{props.version}</span>,
          }}
        >
          {translate({
            id: 'reference.doc.since',
            message: 'This Hook is available since {version}.',
          })}
        </Interpolate>
      </div>
    </div>
  )
}
