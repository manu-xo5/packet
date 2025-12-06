import { XIcon } from 'lucide-react'
import { useState } from 'react'

function TopTab() {
  const [tabs, setTabs] = useState<string[]>(() => ['asdf', 'asf8as8dfs', 'f67yuh8i'])

  return (
    <div className="h-full flex items-center bg-secondary w-full">
      {tabs.map((_, i) => (
        <div key={i} className="h-full flex items-center gap-2 border-r-[0.5px] text-xs px-3">
          <p>Tab {i + 1}</p>

          <XIcon className="size-3" />
        </div>
      ))}
    </div>
  )
}

export { TopTab }
