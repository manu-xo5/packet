import { fetcher } from '@/lib/fetcher'
import { Loader2Icon, SendHorizontalIcon } from 'lucide-react'
import { METHODS, TMethod } from '../data/methods'
import { CookieObj, HeaderObj, store, useStore } from '../store/fetcher'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { useActionState } from 'react'

function headerRequestDto(headers: HeaderObj) {
  const entries = headers
    .filter(({ deleted }) => !deleted)
    .filter(({ name }) => name.trim().length > 0)
    .map(({ name, value }) => [name, value])

  return Object.fromEntries(entries) as Record<string, string>
}

function headerResponseDto(headers: Record<string, string>) {
  return Object.entries(headers).map(([name, value]) => ({
    id: window.crypto.randomUUID(),
    name,
    value,
    deleted: false,
  }))
}

function cookieRequestDto(cookies: CookieObj[]): string {
  void cookies
  return [
    {
      id: window.crypto.randomUUID(),
      name: 'x-user-id',
      value: Math.random().toString().substring(2, 10),
      deleted: false,
    },
  ]
    .filter(({ deleted }) => !deleted)
    .filter(({ name }) => name.trim().length > 0)
    .map(({ name, value }) => `${name}=${value}`)
    .join(';')
}

function cookieResponseDto(_rawCookie: string): CookieObj[] {
  throw new Error('not implemented')
}

void cookieResponseDto

async function action() {
  const { url, method, request } = store.getState()

  const res = await fetcher(url, {
    method: method,
    headers: headerRequestDto([
      ...request.headers,
      {
        id: window.crypto.randomUUID(),
        name: 'Cookie',
        value: cookieRequestDto(request.cookies),
        deleted: false,
      },
    ]),
  })

  if (!res.ok) {
    console.error(res.error)
    return
  }

  store.setState({
    response: {
      headers: headerResponseDto(res.value.headers),
      text: res.value.text,
    },
  })
}

function UrlInput() {
  const { url, method } = useStore()
  const [, dispatch, isPending] = useActionState(action, undefined)

  return (
    <form className="flex gap-3" action={dispatch}>
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
        {isPending ? <Loader2Icon className="animate-spin" /> : <SendHorizontalIcon />}
      </Button>
      {/* <Input placeholder="http://..." name="url" defaultValue="http://192.168.0.3:6002/auth/me" /> */}
    </form>
  )
}

export { UrlInput }
