import { cn } from '@/lib/utils'
import { Fragment } from 'react'
import { HeaderObj } from '../store/fetcher'
import { AutoCompleteList } from './auto-complete-list'
import { Editable } from './editable'

type Props = {
  headers: HeaderObj
} & (
  | {
      editable?: false
      onHeaderChangeName?: undefined
      onHeaderChangeValue?: undefined
      onDeleteChange?: undefined
    }
  | {
      editable?: true
      onHeaderChangeName: (i: number, name: string) => void
      onHeaderChangeValue: (i: number, value: string) => void
      onDeleteChange: (i: number, deleted: boolean) => void
    }
)

export function HeaderTab({
  headers,
  editable = false,
  onHeaderChangeName,
  onHeaderChangeValue,
  onDeleteChange,
}: Props) {
  return (
    <>
      <div className="overflow-x-auto flex-1 bg-card">
        <div className="grid grid-cols-3 text-sm">
          <Fragment>
            <p className="opacity-70 py-1 border-b flex items-center gap-3 px-4">
              <input type="checkbox" className={cn('invisible')} checked={false} disabled readOnly />

              <span className="flex-1">Key</span>
            </p>

            <span className="opacity-70 col-span-2 border-b border-l outline-none py-1 px-3">Value</span>
          </Fragment>

          {headers.map(({ id, name, value, deleted }, i) => (
            <Fragment key={id}>
              <p className="py-2 border-b flex items-center gap-3 px-4">
                <input
                  type="checkbox"
                  className={cn(!editable && 'invisible')}
                  disabled={!editable}
                  checked={deleted}
                  onChange={(ev) => onDeleteChange?.(i, ev.currentTarget.checked)}
                />

                <Editable
                  className="flex-1"
                  id={id}
                  editable={editable}
                  value={name}
                  onChange={(ev) => {
                    onHeaderChangeName?.(i, ev.currentTarget.value)
                  }}
                />
              </p>

              <Editable
                className="col-span-2 border-b border-l outline-none py-2 px-3"
                editable={editable}
                value={value}
                onChange={(ev) => onHeaderChangeValue?.(i, ev.currentTarget.value)}
              />

              <AutoCompleteList offset={15} htmlFor={id} />
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
