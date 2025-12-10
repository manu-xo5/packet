import { cn } from '@/lib/utils'
import { Textarea } from './ui/textarea'

function BodyTab({ className, text }: { className?: string; text: string }) {
  const jsonStringified = (() => {
    try {
      if (!text) return ''
      return JSON.stringify(JSON.parse(text), null, 2)
    } catch (err) {
      return err instanceof Error ? err.message : String(err)
    }
  })()

  return <Textarea className={cn('overflow-x-auto flex-1', className)} value={jsonStringified} readOnly />
}

export { BodyTab }
