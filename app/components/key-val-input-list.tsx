import { cn } from '@/lib/utils'
import { Fragment } from 'react'
import { AutoCompleteList } from './auto-complete-list'
import { Editable, EditableProps } from './editable'

function KeyValEditable({ className, ...props }: EditableProps) {
  return <Editable className={cn('border-b border-l outline-none py-2 px-4', className)} {...props} />
}

type Item = {
  id: string
  name: string
  value: string
  deleted: boolean
}

type Props = {
  items: Item[]
} & (
  | {
      editable?: true
      onChangeName: (i: number, name: Item['name']) => void
      onChangeValue: (i: number, value: Item['value']) => void
      onDeleteChange: (i: number, deleted: boolean) => void
    }
  | {
      editable?: false
      onChangeName?: undefined
      onChangeValue?: undefined
      onDeleteChange?: undefined
    }
)

function KeyValInputList({ items, editable = false, onChangeName, onChangeValue, onDeleteChange }: Props) {
  return (
    <div className="overflow-x-auto flex-1 bg-card h-full">
      <div className="grid grid-cols-[auto_1fr_1fr_1fr] text-sm">
        {items.length === 0
          ? null
          : items.map(({ id, name, value, deleted }, i) => (
              <Fragment key={id}>
                <div className="border-b fcenter pl-3">
                  <input
                    type="checkbox"
                    className={cn(!editable && 'invisible')}
                    disabled={!editable}
                    checked={deleted}
                    onChange={(ev) => onDeleteChange?.(i, ev.currentTarget.checked)}
                  />
                </div>

                <KeyValEditable
                  id={id}
                  className="flex-1 border-l-0"
                  editable={editable}
                  value={name}
                  onChange={(ev) => {
                    onChangeName?.(i, ev.currentTarget.value)
                  }}
                />

                <KeyValEditable
                  className="col-span-2 px-12"
                  editable={editable}
                  value={value}
                  onChange={(ev) => onChangeValue?.(i, ev.currentTarget.value)}
                />

                <AutoCompleteList offset={15} htmlFor={id} />
              </Fragment>
            ))}
      </div>
    </div>
  )
}

export { KeyValInputList, KeyValEditable }
