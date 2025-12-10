import { Signal, useComputed, useSignal } from '@preact/signals-react'
import { createContext, use } from 'react'
import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { TMethod } from '../data/methods'
import { update$ } from '@/lib/signal/utils'
import { produce } from 'immer'

export type HeaderObj = Array<{
  id: string
  name: string
  value: string
  deleted: boolean
}>

export type CookieObj = {
  id: string
  name: string
  value: string
  deleted: boolean
}

type FetcherStore = {
  url: string
  method: TMethod

  request: {
    text: string
    headers: HeaderObj
    cookies: CookieObj[]
  }

  response: {
    text: string
    headers: HeaderObj
  }
}

const initialState: FetcherStore = {
  // url: '',
  // url: 'https://jsonplaceholder.typicode.com/posts',
  url: 'https://postman-echo.com/cookies',
  method: 'GET',

  request: {
    text: '',
    headers: [{ id: window.crypto.randomUUID(), name: 'content-type', value: 'application/json', deleted: false }],
    cookies: [],
  },

  response: {
    text: '',
    headers: [],
  },
}

const createFetcherStore = () =>
  createStore(
    persist(
      immer(
        (): FetcherStore => ({
          url: 'https://jsonplaceholder.typicode.com/posts',
          method: 'GET',
          request: {
            text: '',
            headers: [
              { id: window.crypto.randomUUID(), name: 'content-type', value: 'application/json', deleted: false },
            ],
            cookies: [],
          },
          response: {
            text: '',
            headers: [],
          },
        })
      ),
      {
        name: window.crypto.randomUUID(),
        storage: {
          getItem: () => null,
          setItem: async (name, value) => {
            const existing = await window.fs.readFile('./packet-state', 'utf-8').catch(() => '{}')
            const newState = (() => {
              try {
                return JSON.stringify({ ...JSON.parse(existing), [name]: value }, null, 2)
              } catch {
                return JSON.stringify({ [name]: value })
              }
            })()
            await window.fs.writeFile('./packet-state', newState)
            console.log('save me', {
              name,
              value,
            })
          },
          removeItem: () => {},
        },
      }
    )
  )

// Context

type Fetcher = {
  id: string
}

type FetcherStoreApi = ReturnType<typeof createFetcherStore>
type FetcherCtx = [Fetcher, FetcherStoreApi]

const FetcherStoreCtx = createContext<FetcherCtx | undefined>(undefined)

function useFetcherStore() {
  const ctxValue = use(FetcherStoreCtx)
  if (!ctxValue) {
    throw new Error('useFetcher() can not be used outside FetcherStoreCtx')
  }

  return ctxValue
}

const C = createContext<
  | {
      fetchers$: Signal<Record<FetcherId, FetcherStore>>
      selectedId$: Signal<FetcherId | undefined>
    }
  | undefined
>(undefined)

type FetcherId = string

const CProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchers$ = useSignal<Record<FetcherId, FetcherStore>>({})
  const selectedId$ = useSignal<FetcherId | undefined>(undefined)

  return (
    <C.Provider
      value={{
        fetchers$,
        selectedId$,
      }}
    >
      {children}
    </C.Provider>
  )
}

const useC = () => {
  const ctxValue = use(C)

  if (!ctxValue) {
    throw new Error('useFetcher() can not be used outside FetcherStoreCtx')
  }

  const { fetchers$, selectedId$ } = ctxValue

  const curFetcher$ = useComputed(() => {
    if (!selectedId$.value) {
      return undefined
    }

    return fetchers$.value[selectedId$.value]
  })

  const updateCur$ = (updater: (draft: FetcherStore) => void) => {
    const selectedId = selectedId$.peek()

    if (!selectedId) {
      return
    }

    const curFetcher = fetchers$.peek()[selectedId]

    fetchers$.value = {
      ...fetchers$.peek(),
      [selectedId]: produce(curFetcher, updater),
    }
  }

  return {
    ...ctxValue,
    curFetcher$,
    updateCur$,
  }
}

const useFetcher__new = (id: FetcherId) => {
  const { fetchers$ } = useC()

  const fetcher = useComputed(() => fetchers$.value[id])

  return fetcher
}

const useCurFetcher__new = () => {
  const { selectedId$, fetchers$ } = useC()

  const selectedFetcher$ = useComputed(() => {
    if (!selectedId$.value) {
      return undefined
    }

    return fetchers$.value[selectedId$.value]
  })

  return selectedFetcher$
}

const createDefaultFetcher = (): FetcherStore => ({
  // url: '',
  // url: 'https://jsonplaceholder.typicode.com/posts',
  url: 'https://postman-echo.com/cookies',
  method: 'GET',

  request: {
    text: '',
    headers: [{ id: window.crypto.randomUUID(), name: 'content-type', value: 'application/json', deleted: false }],
    cookies: [],
  },

  response: {
    text: '',
    headers: [],
  },
})

export {
  createFetcherStore,
  FetcherStoreCtx,
  useFetcherStore,
  type FetcherCtx,
  type FetcherStore,
  type FetcherStoreApi,
  CProvider,
  useC,
  useFetcher__new,
  useCurFetcher__new,
  createDefaultFetcher,
}
