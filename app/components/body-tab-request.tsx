import { store, useStore } from '../store/fetcher'
import { Textarea } from './ui/textarea'

function RequestBodyTab() {
  const text = useStore().request.text
  const error = (() => {
    try {
      if (!text.trim()) return ''
      JSON.parse(text)
      return ''
    } catch (err) {
      return err instanceof Error ? err.message : String(err)
    }
  })()

  const tabWidth = 2
  const getIndentationLevel = (cursor: number) => {
    let level = 0
    for (let i = 0; i < text.length && i < cursor; i++) {
      const char = text[i]
      if (char === '{' || char === '[') {
        level += 1
        continue
      }

      if (char === '}' || char === ']') {
        level -= 1
        continue
      }
    }

    return Math.max(0, level)
  }

  return (
    <div className="h-full flex border-input border overflow-hidden">
      <Textarea
        className="overflow-x-auto h-full border-0 rounded-r-none font-mono"
        value={text}
        onKeyDown={(ev) => {
          if (ev.key === 'Tab') {
            const cursor = ev.currentTarget.selectionStart
            const indentationLevel = getIndentationLevel(cursor)
            const indentation = indentationLevel * tabWidth

            ev.preventDefault()
            ev.currentTarget.value = [
              ev.currentTarget.value.slice(0, cursor),
              ' '.repeat(indentation),
              ev.currentTarget.value.slice(cursor),
            ].join('')

            ev.currentTarget.selectionStart = cursor + indentation
            ev.currentTarget.selectionEnd = cursor + indentation
            return
          }

          if (ev.key === 'Enter') {
            ev.preventDefault()
            const cursor = ev.currentTarget.selectionStart
            const indentation = getIndentationLevel(cursor) * tabWidth
            ev.currentTarget.value = [
              ev.currentTarget.value.slice(0, cursor),
              '\n',
              ' '.repeat(indentation),
              ev.currentTarget.value.slice(cursor),
            ].join('')

            ev.currentTarget.selectionStart = cursor + indentation + 1
            ev.currentTarget.selectionEnd = cursor + indentation + 1
            return
          }
        }}
        onChange={(ev) => {
          store.setState((s) => {
            s.request.text = ev.currentTarget.value
          })
        }}
        placeholder={`{\n\t"hello": "world"\n\t...\n}`}
      />

      {error ? (
        <div className="w-[300px] overflow-auto p-3 border-l-input border-l bg-secondary">
          <p className="text-destructive">{error}</p>
        </div>
      ) : null}
    </div>
  )
}

export { RequestBodyTab }
