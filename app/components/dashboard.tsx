import { Sidebar } from '@/app/components/sidebar'
import { FilesProvider, useFiles } from '@/app/store/files'
import { Activity, useState } from 'react'
import { FetcherStoreCtx, useStore } from '../store/fetcher'
import { BodyTab } from './body-tab'
import { RequestBodyTab } from './body-tab-request'
import { CookieTab } from './cookie-tab'
import { HeaderTab } from './header-tab'
import { RequestHeaderTab } from './header-tab-request'
import { TabButton, TabGroup } from './ui/tabs'
import { UrlInput } from './url-input'

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

        <div className="pt-12 px-0 h-full flex flex-col">
          <div className="mt-3">
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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="py-3 pl-3 flex items-center">
        <p>Request:</p>

        <div className="flex gap-3 px-3">
          <TabGroup>
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
        </div>
      </div>

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
    <div className="w-full h-full flex flex-col">
      <div className="py-3 pl-3 flex items-center">
        <p>Response:</p>

        <div className="flex gap-3 px-3">
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
        </div>
      </div>

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
