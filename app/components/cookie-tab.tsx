import { KeyValInputList } from '@/app/components/key-val-input-list'
import { useC } from '@/app/store/fetcher'

const CookieTab = () => {
  const { curFetcher$, updateCur$ } = useC()

  const cookies = curFetcher$.value?.request.cookies ?? []

  return (
    <KeyValInputList
      items={cookies}
      onChangeName={(i, name) => {
        updateCur$((s) => {
          s.request.cookies[i].name = name
        })
      }}
      onChangeValue={(i, value) => {
        updateCur$((s) => {
          s.request.cookies[i].value = value
        })
      }}
      onDeleteChange={(i, deleted) => {
        updateCur$((s) => {
          s.request.cookies[i].deleted = deleted
        })
      }}
    />
  )
}

export { CookieTab }
