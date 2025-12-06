import { Sidebar } from '@/app/components/sidebar'
import { FilesProvider, useFiles } from '@/app/store/files'
import { Activity, useRef, useState } from 'react'
import { FetcherStoreCtx, useStore } from '../store/fetcher'
import { BodyTab } from './body-tab'
import { RequestBodyTab } from './body-tab-request'
import { CookieTab } from './cookie-tab'
import { HeaderTab } from './header-tab'
import { RequestHeaderTab } from './header-tab-request'
import { TabButton, TabGroup } from './ui/tabs'
import { UrlInput } from './url-input'
import { ResizeBar } from './resize-bar'

function Dashboard() {
  return (
    <FilesProvider>
      <Inner />
    </FilesProvider>
  )
}

function Inner() {
  const { fetchers, selected } = useFiles()
  const selectedFetcher = fetchers[selected]

  if (!selectedFetcher) {
    throw new Error('invariant')
  }

  return (
    <FetcherStoreCtx value={[selectedFetcher.details, selectedFetcher.store]}>
      <div className="grid grid-cols-[auto_1fr] h-full">
        <Sidebar />

        <div className="px-0 h-full flex flex-col">
          <header className="h-header bg-card"></header>

          <div className="border-t border-black">
            <UrlInput />
          </div>

          <div className="flex-1 flex-col flex min-h-0">
            <RequestBox />
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <ResponseBox />
          </div>
        </div>
      </div>
    </FetcherStoreCtx>
  )
}

function RequestBox() {
  const [selectedTab, setTab] = useState<'headers' | 'body' | 'cookie'>('headers')
  const ref = useRef<any>(null)

  return (
    <div className="w-full h-full flex flex-col relative bg-card border-t-[0.5px]" ref={ref}>
      <ResizeBar targetRef={ref} orientation="horizontal" />

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

      <Activity mode={selectedTab === 'headers' ? 'visible' : 'hidden'}>
        <RequestHeaderTab />
      </Activity>

      <Activity mode={selectedTab === 'body' ? 'visible' : 'hidden'}>
        <div className="flex-1 min-h-0">
          <RequestBodyTab />
        </div>
      </Activity>

      <Activity mode={selectedTab === 'cookie' ? 'visible' : 'hidden'}>
        <div className="flex-1 min-h-0">
          <CookieTab />
        </div>
      </Activity>
    </div>
  )
}

function ResponseBox() {
  const {
    response: { headers, text },
  } = useStore()
  const [selectedTab, setTab] = useState<'headers' | 'body' | 'cookie'>('headers')

  return (
    <div className="w-full h-full flex flex-col bg-card border-t-[0.5px]">
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

      <Activity mode={selectedTab === 'headers' ? 'visible' : 'hidden'}>
        <HeaderTab headers={headers} />
      </Activity>

      <Activity mode={selectedTab === 'body' ? 'visible' : 'hidden'}>
        <BodyTab text={text} />
      </Activity>
    </div>
  )
}

export { Dashboard }
