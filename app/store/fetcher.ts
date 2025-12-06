import { createContext, use } from 'react'
import { createStore, useStore as useZustandStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { TMethod } from '../data/methods'

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

const store = createStore(immer((): FetcherStore => initialState))

const createFetcherStore = () =>
  createStore(
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
    )
  )

const useStore = () => useZustandStore(store)

// Context

type Fetcher = {
  id: string
}

type FetcherCtx = [Fetcher, typeof store]

const FetcherStoreCtx = createContext<FetcherCtx | undefined>(undefined)

function useFetcherStore() {
  const ctxValue = use(FetcherStoreCtx)
  if (!ctxValue) {
    throw new Error('useFetcher() can not be used outside FetcherStoreCtx')
  }

  return ctxValue
}

export { FetcherStoreCtx, store, createFetcherStore, useFetcherStore, useStore, type FetcherCtx, type FetcherStore }
