import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

type Props = {
  icon: React.FC<{ className?: string }>
} & Omit<React.ComponentProps<'button'>, 'icon'>

const variants = cva('', {
  variants: {
    variant: {
      default: '',
    },
    size: {
      default: 'h-6 px-2 rounded-md hover:bg-secondary',
    },
  },

  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

function IconButton({ className, icon: Icon, ...props }: Props) {
  return (
    <button className={cn(variants({ className }))} {...props}>
      <Icon className="size-4" />
    </button>
  )
}

export { IconButton }
