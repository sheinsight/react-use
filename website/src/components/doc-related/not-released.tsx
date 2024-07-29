import { translate } from '@docusaurus/Translate'

export function NotReleased() {
  return (
    <div className="rounded px-4 py-2 bg-amber/12 my-4 flex items-center gap-1">
      <span className="i-mdi-warning-outline" />
      <div>
        {translate({
          id: 'reference.doc.notReleased',
          message: "IMPORTANT: This Hook hasn't been released yet, so don't try to use it for the time being.",
        })}
      </div>
    </div>
  )
}
