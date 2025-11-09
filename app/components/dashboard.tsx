import { Activity, useState } from 'react'
import { useStore } from '../store/fetcher'
import { BodyTab } from './body-tab'
import { HeaderTab } from './header-tab'
import { RequestHeaderTab } from './header-tab-request'
import { TabButton, TabGroup } from './ui/tabs'
import { UrlInput } from './url-input'

function Dashboard() {
  return (
    <div className="p-12 h-full flex flex-col">
      <div className="mt-3">
        <UrlInput />
      </div>

      <div className="flex-1 flex-col flex">
        <RequestBox />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <ResponseBox />
      </div>
    </div>
  )
}

function RequestBox() {
  const {
    request: { text },
  } = useStore()
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
        <RequestHeaderTab />
      </Activity>

      <Activity mode={selectedTab === 'body' ? 'visible' : 'hidden'}>
        <BodyTab text={text} />
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
