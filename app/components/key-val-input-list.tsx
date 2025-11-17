import { cn } from '@/lib/utils'
import { Fragment } from 'react'
import { AutoCompleteList } from './auto-complete-list'
import { Editable, EditableProps } from './editable'

function KeyValEditable({className, ...props}: EditableProps) {
  return (
    <Editable
      className={cn("col-span-2 border-b border-l outline-none py-2 px-12", className)}
      {...props}
    />
  )
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
      onHeaderChangeName: (i: number, name: Item['name']) => void
      onHeaderChangeValue: (i: number, value: Item['value']) => void
      onDeleteChange: (i: number, deleted: boolean) => void
    }
  | {
      editable?: false
      onHeaderChangeName?: undefined
      onHeaderChangeValue?: undefined
      onDeleteChange?: undefined
    }
)

function KeyValInputList({ items, editable = false, onHeaderChangeName, onHeaderChangeValue, onDeleteChange }: Props) {
  return (
    <>
      <div className="overflow-x-auto flex-1 bg-card rounded-md">
        <div className="grid grid-cols-3 text-sm">
          {items.map(({ id, name, value, deleted }, i) => (
            <Fragment key={id}>
              <p className="py-2 border-b pl-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  className={cn(!editable && 'invisible')}
                  disabled={!editable}
                  checked={deleted}
                  onChange={(ev) => onDeleteChange?.(i, ev.currentTarget.checked)}
                />

                <Editable
                  id={id}
                  className="flex-1"
                  editable={editable}
                  value={name}
                  onChange={(ev) => {
                    onHeaderChangeName?.(i, ev.currentTarget.value)
                  }}
                />
              </p>

              <KeyValEditable
                className="col-span-2 border-b border-l outline-none py-2 px-12"
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

export { KeyValInputList, KeyValEditable }
