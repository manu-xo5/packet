import { Textarea } from './ui/textarea'

export function BodyTab({ text }: { text: string }) {
  const jsonStringified = (() => {
    try {
      if (!text) return ''
      return JSON.stringify(JSON.parse(text), null, 2)
    } catch (err) {
      return err instanceof Error ? err.message : String(err)
    }
  })()

  return <Textarea className="overflow-x-auto flex-1" value={jsonStringified} readOnly />
}
