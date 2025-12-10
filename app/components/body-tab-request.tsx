import { useComputed } from '@preact/signals-react'
import { useC } from '../store/fetcher'
import { Textarea } from './ui/textarea'

function RequestBodyTab() {
  const { curFetcher$, updateCur$ } = useC()

  const error$ = useComputed(() => {
    try {
      const text = curFetcher$.value?.request.text ?? ''

      if (!text.trim()) return ''
      JSON.parse(text)
      return ''
    } catch (err) {
      return err instanceof Error ? err.message : String(err)
    }
  })

  const tabWidth = 2
  const getIndentationLevel = () => {
    throw new Error('not implemented')
  }
  void getIndentationLevel

  return (
    <div className="h-full flex bg-sidebar overflow-hidden">
      <Textarea
        className="overflow-x-auto h-full border-0 rounded-none font-mono bg-transparent dark:bg-transparent"
        value={curFetcher$.value?.request.text ?? ''}
        onKeyDown={(ev) => {
          const cursor = ev.currentTarget.selectionStart

          if (ev.key === 'Tab') {
            ev.preventDefault()
            ev.currentTarget.value = [
              ev.currentTarget.value.slice(0, cursor),
              ' '.repeat(tabWidth),
              ev.currentTarget.value.slice(cursor),
            ].join('')

            ev.currentTarget.selectionStart = cursor + tabWidth
            ev.currentTarget.selectionEnd = cursor + tabWidth
            return
          }
        }}
        onChange={(ev) => {
          const value = ev.currentTarget.value

          updateCur$((d) => {
            d.request.text = value
          })
        }}
        placeholder={`{\n\t"hello": "world"\n\t...\n}`}
      />

      {error$.value ? (
        <div className="w-[300px] overflow-auto p-3 border-l-input border-l bg-secondary">
          <p className="text-destructive">{error$.value}</p>
        </div>
      ) : null}
    </div>
  )
}

export { RequestBodyTab }
