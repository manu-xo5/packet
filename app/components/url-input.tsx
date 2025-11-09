import { fetcher } from '@/lib/fetcher'
import { SendHorizontalIcon } from 'lucide-react'
import { METHODS, TMethod } from '../data/methods'
import { store, useStore } from '../store/fetcher'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'

function headerDto(headers: Record<string, string>) {
  const entries = Object.entries(headers).map(([key, value]) => [key, { value, deleted: false }])
  return Object.fromEntries(entries)
}

function UrlInput() {
  const { url, method } = useStore()

  return (
    <form
      className="flex gap-3"
      action={async () => {
        const res = await fetcher(url, { method: method })
        if (!res.ok) {
          console.error(res.error)
          return
        }

        store.setState({
          response: {
            headers: headerDto(res.value.headers),
            text: res.value.text,
          },
        })
      }}
    >
      <Select
        value={method}
        onValueChange={(next) => {
          store.setState({ method: next as TMethod })
        }}
      >
        <SelectTrigger className="w-32">{method}</SelectTrigger>

        <SelectContent>
          {METHODS.map((methodName) => (
            <SelectItem key={methodName} value={methodName}>
              {methodName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="http://..."
        name="url"
        value={url}
        onChange={(e) => {
          const value = e.currentTarget.value
          store.setState({ url: value })
        }}
      />

      <Button type="submit">
        Send
        <SendHorizontalIcon />
      </Button>
      {/* <Input placeholder="http://..." name="url" defaultValue="http://192.168.0.3:6002/auth/me" /> */}
    </form>
  )
}

export { UrlInput }
