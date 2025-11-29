import { useStore } from 'zustand'
import { useFetcherStore } from '@/app/store/fetcher'
import { KeyValInputList } from '@/app/components/key-val-input-list'

const CookieTab = () => {
  const [, store] = useFetcherStore()
  const cookies = useStore(store, (s) => s.request.cookies)

  return (
    <KeyValInputList
      items={cookies}
      onChangeName={(i, name) => {
        store.setState((s) => {
          s.request.cookies[i].name = name
        })
      }}
      onChangeValue={(i, value) => {
        store.setState((s) => {
          s.request.cookies[i].value = value
        })
      }}
      onDeleteChange={(i, deleted) => {
        store.setState((s) => {
          s.request.cookies[i].deleted = deleted
        })
      }}
    />
  )
}

export { CookieTab }
