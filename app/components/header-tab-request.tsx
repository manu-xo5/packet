import { useSignalEffect } from '@preact/signals-react'
import { useC } from '../store/fetcher'
import { HeaderTab } from './header-tab'

export function RequestHeaderTab() {
  const { curFetcher$, updateCur$ } = useC()

  const headers = curFetcher$.value?.request.headers

  useSignalEffect(() => {
    if (!curFetcher$.value) return

    const headers = curFetcher$.value.request.headers

    const last2nd = headers.at(-2)
    const last = headers.at(-1)
    if (!last) return

    if (last.name === '' && last.value === '' && last2nd?.name === '' && last2nd?.value === '') {
      updateCur$((d) => {
        d.request.headers.pop()
      })
      return
    }

    if (last.name === '' && last.value === '') {
      return
    }

    updateCur$((d) => {
      d.request.headers.push({
        id: window.crypto.randomUUID(),
        name: '',
        value: '',
        deleted: false,
      })
    })
  })

  return (
    <HeaderTab
      headers={headers ?? []}
      editable
      onHeaderChangeName={(i, value) => {
        updateCur$((d) => {
          d.request.headers[i].name = value
        })
      }}
      onHeaderChangeValue={(i, value) => {
        updateCur$((d) => {
          d.request.headers[i].value = value
        })
      }}
      onDeleteChange={(i, isDeleted) => {
        updateCur$((d) => {
          d.request.headers[i].deleted = isDeleted
        })
      }}
    />
  )
}
