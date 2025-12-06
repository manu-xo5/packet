import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NewTopTab } from '../events'

function TopTab() {
  const [tabs, setTabs] = useState<string[]>(() => ['asdf', 'asf8as8dfs', 'f67yuh8i'])

  useEffect(() => {
    const handle = () => {
      setTabs((prev) => prev.concat(Math.random().toString(16)))
    }

    window.addEventListener(NewTopTab.type, handle)

    return () => window.removeEventListener(NewTopTab.type, handle)
  }, [])

  return (
    <div className="h-full flex items-center bg-secondary w-full">
      {tabs.map((id, i) => (
        <div
          key={i}
          className="h-full flex items-center gap-2 border-r-[0.5px] text-xs px-3 [-webkit-app-region:no-drag]"
        >
          <p>Tab {i + 1}</p>

          <button className="box-content p-0.5 hover:bg-gray-500/50 transition-colors rounded-full">
            <XIcon
              className="size-2.5"
              onClick={() => {
                setTabs((prev) => prev.filter((xid) => id !== xid))
              }}
            />
          </button>
        </div>
      ))}
    </div>
  )
}

export { TopTab }
