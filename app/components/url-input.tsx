import { fetcher } from '@/lib/fetcher'
import { Loader2Icon, SendHorizontalIcon } from 'lucide-react'
import { METHODS, TMethod } from '../data/methods'
import { CookieObj, HeaderObj, store, useFetcherStore } from '../store/fetcher'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { useActionState } from 'react'
import { useStore } from 'zustand'

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
  const [, store] = useFetcherStore()
  const { url, method } = useStore(store)
  const [, dispatch, isPending] = useActionState(action, undefined)

  return (
    <form className="h-11 flex items-center bg-secondary dark:bg-input/30 pr-3" action={dispatch}>
      <Select
        value={method}
        onValueChange={(next) => {
          store.setState({ method: next as TMethod })
        }}
      >
        <SelectTrigger className="rounded-none border-none w-auto bg-transparent dark:bg-transparent dark:text-primary font-bold">
          {method}
        </SelectTrigger>

        <SelectContent>
          {METHODS.map((methodName) => (
            <SelectItem key={methodName} value={methodName}>
              {methodName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        className="pl-0 rounded-none border-none bg-transparent dark:bg-transparent text-xs! font-[monospace]"
        placeholder="http://..."
        name="url"
        value={url}
        onChange={(e) => {
          const value = e.currentTarget.value
          store.setState({ url: value })
        }}
      />

      <Button type="submit" className="border-none text-xs! h-7! gap-1">
        Send
        {isPending ? <Loader2Icon className="animate-spin" /> : <Svg />}
      </Button>
      {/* <Input placeholder="http://..." name="url" defaultValue="http://192.168.0.3:6002/auth/me" /> */}
    </form>
  )
}

function Svg() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 26.6699 24.1504"
      className="size-3"
    >
      <g>
        <rect height="24.1504" opacity="0" width="26.6699" x="0" y="0" />
        <path
          d="M1.08398 14.4824C1.08398 14.9219 1.44531 15.2637 1.88477 15.2832L5.76172 15.4297L22.3926 15.4297C25.1172 15.4297 26.3086 14.1406 26.3086 11.4551L26.3086 3.91602C26.3086 1.19141 25.1172 0 22.3926 0L14.9219 0C14.3359 0 13.9551 0.419922 13.9551 0.947266C13.9551 1.46484 14.3359 1.89453 14.9121 1.89453L22.3926 1.89453C23.7695 1.89453 24.4141 2.53906 24.4141 3.91602L24.4141 11.4551C24.4141 12.8906 23.7598 13.5352 22.3926 13.5352L5.76172 13.5352L1.88477 13.6914C1.44531 13.7109 1.08398 14.043 1.08398 14.4824ZM0 14.4824C0 14.7461 0.0976562 14.9902 0.3125 15.1953L7.79297 22.5781C7.97852 22.7637 8.25195 22.8711 8.48633 22.8711C9.05273 22.8711 9.42383 22.4805 9.42383 21.9336C9.42383 21.6602 9.33594 21.4453 9.16992 21.2793L5.3125 17.4902L2.27539 14.8145L2.27539 14.1504L5.3125 11.4746L9.16992 7.68555C9.33594 7.51953 9.42383 7.30469 9.42383 7.03125C9.42383 6.48438 9.05273 6.09375 8.48633 6.09375C8.25195 6.09375 7.97852 6.21094 7.79297 6.38672L0.3125 13.7793C0.0976562 13.9746 0 14.2188 0 14.4824Z"
          fill="white"
          fillOpacity="0.85"
        />
      </g>
    </svg>
  )
}

export { UrlInput }
