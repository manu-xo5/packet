import { useEffect } from 'react'
import { HeaderObj, store, useStore } from '../store/fetcher'
import { HeaderTab } from './header-tab'

export function RequestHeaderTab() {
  const headers = useStore().request.headers

  const handleAppendNewHeader = (headers: HeaderObj) => {
    const last2nd = headers.at(-2)
    const last = headers.at(-1)
    if (!last) return

    if (last.name === '' && last.value === '' && last2nd?.name === '' && last2nd?.value === '') {
      store.setState((s) => {
        s.request.headers.pop()
      })
      return
    }

    if (last.name === '' && last.value === '') {
      return
    }

    store.setState((s) => {
      s.request.headers.push({
        id: window.crypto.randomUUID(),
        name: '',
        value: '',
        deleted: false,
      })
    })
  }

  useEffect(() => {
    handleAppendNewHeader(store.getState().request.headers)

    const unsub = store.subscribe((cur) => {
      handleAppendNewHeader(cur.request.headers)
    })

    return () => unsub()
  }, [])

  return (
    <HeaderTab
      headers={headers}
      editable
      onHeaderChangeName={(i, value) => {
        store.setState((s) => {
          s.request.headers[i].name = value
        })
      }}
      onHeaderChangeValue={(i, value) => {
        store.setState((s) => {
          s.request.headers[i].value = value
        })
      }}
      onDeleteChange={(i, isDeleted) => {
        store.setState((s) => {
          s.request.headers[i].deleted = isDeleted
        })
      }}
    />
  )
}
