export function BodyTab({ text }: { text: string }) {
  const jsonStringified = (() => {
    try {
      if (!text) return ''
      return JSON.stringify(JSON.parse(text), null, 2)
    } catch (err) {
      return err instanceof Error ? err.message : String(err)
    }
  })()

  return (
    <div className="overflow-x-auto p-3 flex-1 bg-card rounded-md">
      <pre>{text && jsonStringified}</pre>
    </div>
  )
}
