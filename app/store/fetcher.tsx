import { Signal, useComputed, useSignal } from '@preact/signals-react'
import { produce } from 'immer'
import { createContext, use, useEffect } from 'react'
import { TMethod } from '../data/methods'
import { SaveCurFetcher } from '../events'

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

const CWD = window.cwd

const C = createContext<
  | {
      fetchers$: Signal<Record<FetcherId, FetcherStore>>
      selectedId$: Signal<FetcherId | undefined>
    }
  | undefined
>(undefined)

type FetcherId = string

async function getSavedFetchers() {
  const json = await window.fs.readFile(CWD + '/fetchers.json')
  if (!json.ok) {
    return undefined
  }

  const state = await Promise.try(() => JSON.parse(json.data)).catch(() => undefined)

  return state
}

const CProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchers$ = useSignal<Record<FetcherId, FetcherStore>>({
    default: createDefaultFetcher(),
  })
  const selectedId$ = useSignal<FetcherId | undefined>('default')

  useEffect(() => {
    ;(async () => {
      const savedFetchers = await getSavedFetchers()
      if (!savedFetchers) {
        return
      }

      fetchers$.value = savedFetchers
    })()
  }, [fetchers$])

  useEffect(() => {
    const handler = async (e: Event) => {
      if (!SaveCurFetcher.is(e)) return

      const filePath = CWD + '/fetchers.json'

      window.fs.writeFile(filePath, JSON.stringify(fetchers$, null, 4)).catch((err) => console.error(err))
    }

    window.addEventListener(SaveCurFetcher.type, handler)

    return () => window.removeEventListener(SaveCurFetcher.type, handler)
  }, [fetchers$])

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

const createDefaultFetcher = (): FetcherStore => initialState

export { CProvider, createDefaultFetcher, useC, useCurFetcher__new, useFetcher__new, type FetcherStore }
