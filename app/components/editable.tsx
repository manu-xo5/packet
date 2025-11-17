import { cn } from '@/lib/utils'

type EditableProps = {
  editable?: boolean
} & React.ComponentProps<'input'>

function Editable({ editable, className, value, onChange, ...inputProps }: EditableProps) {
  if (editable) {
    return (
      <input
        className={cn('outline-none text-muted-foreground focus:text-primary-foreground', className)}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
    )
  }

  return (
    <span className={cn('text-muted-foreground', className)} {...inputProps}>
      {value}
    </span>
  )
}

export { Editable, type EditableProps }
