import { passOnRef } from '@/lib/react.utils'
import { cn } from '@/lib/utils'
import { useSignal } from '@preact/signals-react'
import { cva, VariantProps } from 'class-variance-authority'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

const variants = cva('', {
  variants: {
    variant: {
      default: '',
    },
    size: {
      fit: 'w-(--fit-width)',
      default: 'w-fit min-w-0',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

type Props = {
  accessory?: React.ReactNode
} & VariantProps<typeof variants> &
  Omit<React.ComponentProps<'select'>, 'size'>

function NativeSelect({ className, accessory, size, onChange, ...props }: Props) {
  const selectValue$ = useSignal('')

  const selectRef = React.useRef<HTMLSelectElement>(null)

  const selectClassNames = cn(
    variants({
      size: size,
      className: cn(
        'placeholder:text-muted-foreground dark:bg-input/30 appearance-none bg-input px-3 py-2 text-sm transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed',
        'aria-invalid:text-destructive/20 dark:aria-invalid:text-destructive/40',
        className
      ),
    })
  )
  return (
    <>
      <div
        className="group/native-select relative w-fit has-[select:disabled]:opacity-50"
        data-slot="native-select-wrapper"
      >
        <select
          ref={(node) => {
            passOnRef(props.ref, node)
            selectRef.current = node

            if (!node) return
            selectValue$.value = node.value ?? ''
          }}
          data-slot="native-select"
          className={cn(selectClassNames, "")}
          onChange={(ev) => {
            onChange?.(ev)

            const value = ev.currentTarget.value
            selectValue$.value = value
          }}
          {...props}
        />

        {accessory ? (
          accessory
        ) : (
          <ChevronDownIcon
            className="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none"
            aria-hidden="true"
            data-slot="native-select-icon"
          />
        )}
      </div>

      {size === 'fit' && (
        <span
          className={cn(selectClassNames, 'absolute top-1/2 bg-black! left-0 invisible pointer-events-none')}
          ref={(node) => {
            if (!node) return
            if (!selectRef.current) return

            const nodeWidth = node.offsetWidth
            selectRef.current.style.setProperty('--fit-width', nodeWidth + 'px')
          }}
        >
          {selectValue$.value}
        </span>
      )}
    </>
  )
}

function NativeSelectOption({ ...props }: React.ComponentProps<'option'>) {
  return <option data-slot="native-select-option" {...props} />
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<'optgroup'>) {
  return <optgroup data-slot="native-select-optgroup" className={cn(className)} {...props} />
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
