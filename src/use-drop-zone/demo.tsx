import { Card, KeyValue, Zone } from '@/components'
import { useDropZone } from '@shined/use'

export function App() {
  const { isOverDropZone, files } = useDropZone('#drop-zone')

  const color = isOverDropZone ? 'bg-primary/60 text-white' : 'text-gray/80'
  const zoneCls = 'grid size-48 p-4 border-2 border-dashed border-gray/32 rounded-2 place-content-center'

  return (
    <Card>
      <KeyValue label="IsOverDropZone" value={isOverDropZone} />

      <Zone>
        <div id="drop-zone" className={`${zoneCls} ${color}`}>
          {isOverDropZone ? 'Release to drop' : 'Drop files here'}
        </div>
        <img alt="img" src="https://picsum.photos/200/200.jpg" className="size-32 rounded" />
        <span>(It's merely a image, NOT a file. You need to drop files to see files list)</span>
      </Zone>

      <Zone>
        {files?.map((file, index) => (
          <div key={file.name} className="flex items-center space-x-2">
            <img alt="img" src={URL.createObjectURL(file)} className="size-8" />
            <div>
              <div>{file.name}</div>
              <div>{file.size} bytes</div>
            </div>
          </div>
        ))}

        {(!files || files?.length === 0) && 'No files dropped 🤷'}
      </Zone>
    </Card>
  )
}
