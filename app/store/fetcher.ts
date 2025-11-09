import { createStore, useStore as useZustandStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { TMethod } from '../data/methods'

export type HeaderObj = Array<{
  id: string
  name: string
  value: string
  deleted: boolean
}>

type FetcherStore = {
  url: string
  method: TMethod

  request: {
    text: string
    headers: HeaderObj
  }

  response: {
    text: string
    headers: HeaderObj
  }
}

const initialState: FetcherStore = {
  // url: '',
  url: 'https://jsonplaceholder.typicode.com/posts',
  method: 'GET',

  request: {
    text: '',
    headers: [{ id: '', name: 'content-type', value: 'application/json', deleted: false }],
  },

  response: {
    text: '',
    headers: [],
  },
}

const store = createStore(immer((): FetcherStore => initialState))

const useStore = () => useZustandStore(store)

export { store, useStore }
