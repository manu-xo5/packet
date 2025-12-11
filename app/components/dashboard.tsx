import { Sidebar } from '@/app/components/sidebar'
import { useEffect, useRef, useState } from 'react'
import { FocusMainSearch, NewTopTab, SaveCurFetcher } from '../events'
import { CProvider, useC } from '../store/fetcher'
import { BodyTab } from './body-tab'
import { RequestBodyTab } from './body-tab-request'
import { CookieTab } from './cookie-tab'
import { HeaderTab } from './header-tab'
import { RequestHeaderTab } from './header-tab-request'
import { ResizeBar } from './resize-bar'
import { TopTab } from './top-tab'
import { TabButton, TabGroup } from './ui/tabs'
import { UrlInput } from './url-input'

function Dashboard() {
  const ref = useRef<any>(null)

  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        window.dispatchEvent(FocusMainSearch.new())
      }

      if (e.key === 't' && e.metaKey) {
        window.dispatchEvent(NewTopTab.new())
      }

      if (e.key === 's' && e.metaKey) {
        window.dispatchEvent(SaveCurFetcher.new())
      }
    }

    window.addEventListener('keydown', handleKeyboardShortcut)

    return () => window.removeEventListener('keydown', handleKeyboardShortcut)
  }, [])

  return (
    <CProvider>
      <div className="grid grid-cols-[auto_1fr] h-full">
        <Sidebar />

        <div className="px-0 h-full flex flex-col bg-background text-foreground">
          <header className="h-header [-webkit-app-region:drag]">
            <TopTab />
          </header>

          <div className="border-t border-black">
            <UrlInput />
          </div>

          <div
            ref={ref}
            style={{ height: 400, minHeight: '20vh', maxHeight: '70vh' }}
            className="flex-none flex-col flex relative"
          >
            <RequestBox />
            <ResizeBar targetRef={ref} orientation="horizontal" />
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <ResponseBox />
          </div>
        </div>
      </div>
    </CProvider>
  )
}

function RequestBox() {
  const [selectedTab, setTab] = useState<'headers' | 'body' | 'cookie'>('headers')

  return (
    <div className="w-full h-full flex flex-col bg-secondary border-t-[0.5px]">
      <TabGroup className="">
        <TabButton selected={selectedTab === 'headers'} onClick={() => setTab('headers')}>
          Headers
        </TabButton>

        <TabButton selected={'cookie' === selectedTab} onClick={() => setTab('cookie')}>
          Cookie
        </TabButton>

        <TabButton selected={'body' === selectedTab} onClick={() => setTab('body')}>
          Body
        </TabButton>
      </TabGroup>

      <div className="h-[0.5px] bg-border" />

      {selectedTab === 'headers' ? (
        <RequestHeaderTab />
      ) : selectedTab === 'body' ? (
        <div className="flex-1 min-h-0">
          <RequestBodyTab />
        </div>
      ) : selectedTab === 'cookie' ? (
        <div className="flex-1 min-h-0">
          <CookieTab />
        </div>
      ) : null}
    </div>
  )
}

function ResponseBox() {
  const { curFetcher$ } = useC()

  const headers = curFetcher$.value?.response.headers ?? []
  const text = curFetcher$.value?.response.text ?? ''

  const [selectedTab, setTab] = useState<'headers' | 'body' | 'cookie'>('headers')

  return (
    <div className="w-full h-full flex flex-col bg-secondary border-t-[0.5px]">
      <TabGroup>
        <TabButton selected={selectedTab === 'headers'} onClick={() => setTab('headers')}>
          Headers
        </TabButton>

        <TabButton selected={'body' === selectedTab} onClick={() => setTab('body')}>
          Body
        </TabButton>
        <TabButton selected={'cookie' === selectedTab} onClick={() => setTab('cookie')}>
          Cookie
        </TabButton>
      </TabGroup>

      <div className="h-[0.5px] bg-border" />

      {selectedTab === 'headers' ? (
        <div className="bg-card flex-1">
          <HeaderTab headers={headers} />
        </div>
      ) : selectedTab === 'body' ? (
        <div className="flex-1 min-h-0">
          <BodyTab className="h-full bg-transparent dark:bg-card border-none rounded-none ring-0!" text={text} />
        </div>
      ) : (
        <div className="h-full bg-card" />
      )}
    </div>
  )
}

export { Dashboard }
