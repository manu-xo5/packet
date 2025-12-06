import { ResizeBar } from '@/app/components/resize-bar'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { useFiles } from '@/app/store/files'
import { PlusIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useStore } from 'zustand'

function Sidebar() {
  const { fetchers, add, setSelected } = useFiles()
  const sidebarRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div
        ref={sidebarRef}
        className="bg- sidebar text-sidebar-foreground border-r-[0.5px] border-black relative h-full flex flex-col min-h-0"
        style={{
          minWidth: 200,
          width: 300,
          maxWidth: 400,
        }}
      >
        <div
          style={{
            backgroundImage: 'linear-gradient(150deg,rgba(24, 24, 27, 1) 10%, rgba(17, 86, 54, .3) 100%)',
          }}
          className="absolute top-0 left-0 w-full h-full -z-10"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[105px] bg-gray-700/20 -z-5" />

        <header className="h-header p-3 flex justify-end [-webkit-app-region:drag]">
          <Button type="button" variant="secondary" size="icon-xs" onClick={() => add()} className="bg-gray-400/40">
            <PlusIcon className="size-3/4" />
          </Button>
        </header>

        <div className="border-t border-black/0">
          <form className="h-header p-[6.5px] flex items-center">
            <div className="h-full bg-white/10 rounded-sm flex-1 flex items-center gap-1.25 px-2.5">
              <Svg />
              <input className="w-full" placeholder="Search request" />
            </div>
          </form>
        </div>

        <ul className="flex flex-col p-1.5 pb-3 gap-1 flex-1 overflow-auto border-t-[0.5px] border-black/0">
          {Object.values(fetchers).map(({ details: fetcher }) => {
            return <FileItem key={fetcher.id} {...{ fetcher, setSelected }} />
          })}
        </ul>

        <ResizeBar targetRef={sidebarRef} />
      </div>
    </>
  )
}

function FileItem({ fetcher }: { fetcher: { id: string; name?: string } }) {
  const { selected, setSelected, rename, fetchers } = useFiles()
  const [editing, setEditing] = useState(false)

  const method = useStore(fetchers[fetcher.id].store, (s) => s.method)

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
          className="justify-start w-full font-normal h-6 text-sm rounded-sm px-3 relative"
          variant={isSelected ? 'default' : 'ghost'}
          onClick={() => setSelected(fetcher.id)}
          onDoubleClick={() => setEditing(true)}
        >
          <span className='flex size-full bg-gray-400/10 absolute top-0 left-0 rounded-sm z-5' />
          <span className="min-w-0 truncate opacity-100 z-10">
            {method} {fetcher.name}
          </span>
        </Button>
      )}
    </li>
  )
}

function Svg() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 24.7656 24.6387"
      className="size-3"
    >
      <g>
        <rect height="24.6387" opacity="0" width="24.7656" x="0" y="0" />
        <path
          d="M0 9.88281C0 15.3223 4.43359 19.7559 9.88281 19.7559C12.0801 19.7559 14.1016 19.0332 15.7422 17.8125L22.1777 24.2578C22.4219 24.5117 22.7637 24.6387 23.1152 24.6387C23.8867 24.6387 24.4043 24.0527 24.4043 23.3203C24.4043 22.959 24.2773 22.6465 24.043 22.4023L17.6367 15.9668C18.9648 14.2969 19.7656 12.1777 19.7656 9.88281C19.7656 4.43359 15.332 0 9.88281 0C4.43359 0 0 4.43359 0 9.88281ZM1.82617 9.88281C1.82617 5.43945 5.43945 1.82617 9.88281 1.82617C14.3262 1.82617 17.9297 5.43945 17.9297 9.88281C17.9297 14.3164 14.3262 17.9297 9.88281 17.9297C5.43945 17.9297 1.82617 14.3164 1.82617 9.88281Z"
          fill="white"
          fillOpacity="0.85"
        />
      </g>
    </svg>
  )
}

export { Sidebar }
