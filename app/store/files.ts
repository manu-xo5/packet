import { createFetcherStore, FetcherStore, store } from '@/app/store/fetcher'
import createContextHook from '@/lib/create-context-hook'
import { useState } from 'react'
import { StoreApi } from 'zustand'
import { produce } from 'immer'

type Fetcher = {
  id: string
  name?: string
}

const initial = window.crypto.randomUUID()

const [FilesProvider, useFiles] = createContextHook(() => {
  const [selected, setSelected] = useState<Fetcher['id']>(initial)

  const [fetchers, setFetchers] = useState<
    Record<
      string,
      {
        details: Fetcher
        store: StoreApi<FetcherStore>
      }
    >
  >({
    [initial]: {
      store,
      details: {
        id: initial,
        name: 'Untitled Request',
      },
    },
  })

  const add = () => {
    const id = window.crypto.randomUUID()
    const newFetcher: Fetcher = {
      id,
      name: 'Untitled Request',
    }
    const newStore = createFetcherStore()

    setFetchers((prev) => ({
      ...prev,
      [id]: {
        details: newFetcher,
        store: newStore,
      },
    }))

    setSelected(id)
  }

  const rename = (id: string, newName: string) => {
    setFetchers(
      produce((prev) => {
        prev[id].details.name = newName
      })
    )
  }

  return { fetchers, selected, setSelected, add, rename }
})

export { FilesProvider, useFiles }
