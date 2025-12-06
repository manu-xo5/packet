import { ResizeBar } from '@/app/components/resize-bar'
import { Button } from '@/app/components/ui/button'
import { useFiles } from '@/app/store/files'
import { PlusIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { Input } from '@/app/components/ui/input'

function Sidebar() {
  const { fetchers, add, setSelected } = useFiles()
  const sidebarRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={sidebarRef}
      className="bg-sidebar text-sidebar-foreground border-r-[0.5px] relative h-full flex flex-col min-h-0"
      style={{
        minWidth: 200,
        width: 300,
        maxWidth: 400,
      }}
    >
      <div className="h-11.5 p-3 flex justify-end">
        <Button type="button" size="icon-xs" onClick={() => add()}>
          <PlusIcon className="size-3/4" />
        </Button>
      </div>

      <ul className="flex flex-col p-3 gap-1 flex-1 overflow-auto">
        {Object.values(fetchers).map(({ details: fetcher }) => {
          return <FileItem key={fetcher.id} {...{ fetcher, setSelected }} />
        })}
      </ul>

      <ResizeBar targetRef={sidebarRef} />
    </div>
  )
}

export { Sidebar }

function FileItem({ fetcher }: { fetcher: { id: string; name?: string } }) {
  const [editing, setEditing] = useState(false)

  const { selected, setSelected, rename } = useFiles()
  const isSelected = selected === fetcher.id

  return (
    <li key={fetcher.id}>
      {editing ? (
        <Input
          ref={(node) => {
            if (!node) return

            node.focus()
            node.setSelectionRange(0, fetcher.id.length)
          }}
          defaultValue={fetcher.name}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()

              const value = ev.currentTarget.value
              rename(fetcher.id, value)
              setEditing(false)
            }
          }}
          onBlur={(ev) => {
            const value = ev.currentTarget.value
            rename(fetcher.id, value)
            setEditing(false)
          }}
        />
      ) : (
        <Button
          className="justify-start w-full"
          variant={isSelected ? 'secondary' : 'ghost'}
          onClick={() => setSelected(fetcher.id)}
          onDoubleClick={() => setEditing(true)}
        >
          <span className="min-w-0 truncate">{fetcher.name}</span>
        </Button>
      )}
    </li>
  )
}
