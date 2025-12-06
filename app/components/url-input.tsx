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
    <form className="h-[calc(5px+var(--header-height))] flex items-center bg-sidebar" action={dispatch}>
      <Select
        value={method}
        onValueChange={(next) => {
          store.setState({ method: next as TMethod })
        }}
      >
        <SelectTrigger className="rounded-none border-none w-auto bg-transparent dark:bg-transparent text-tertiary font-bold">
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

      <input
        className="w-full pl-0 rounded-none border-none bg-transparent dark:bg-transparent text-xs! font-[monospace]"
        placeholder="http://..."
        name="url"
        value={url}
        onChange={(e) => {
          const value = e.currentTarget.value
          store.setState({ url: value })
        }}
      />

      <Button type="submit" className="border-none text-xs! rounded-sm w-auto h-6! gap-1.5">
        Send
        {isPending ? <Loader2Icon className="animate-spin" /> : <Svg />}
      </Button>

      <Button type="button" className="w-8!" variant="ghost" size="icon-sm">
        <Save />
      </Button>
      {/* <Input placeholder="http://..." name="url" defaultValue="http://192.168.0.3:6002/auth/me" /> */}
    </form>
  )
}

function Svg() {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.6699 24.1504" className="size-2.5">
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

function Save() {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.9512 30.9082" className="size-3.5">
      <g>
        <rect height="30.9082" opacity="0" width="29.9512" x="0" y="0" />
        <path
          d="M24.3457 9.63867L28.9355 15.3809C29.4434 16.0156 29.5898 16.5137 29.5898 17.5488L29.5898 24.8535C29.5898 27.3438 28.3105 28.623 25.7812 28.623L3.79883 28.623C1.2793 28.623 0 27.3535 0 24.8535L0 17.5488C0 16.5137 0.146484 16.0156 0.644531 15.3809L5.24414 9.63867C6.60156 7.95898 7.24609 7.45117 9.3457 7.45117L11.7383 7.45117L11.7383 8.97461L9.19922 8.97461C8.24219 8.97461 7.54883 9.28711 6.93359 10.0684L2.04102 16.2695C1.85547 16.5039 1.93359 16.8164 2.29492 16.8164L10.8691 16.8164C11.4453 16.8164 11.7285 17.2461 11.7285 17.7246L11.7285 17.7832C11.7285 19.3848 12.959 20.9277 14.7949 20.9277C16.6211 20.9277 17.8613 19.3848 17.8613 17.7832L17.8613 17.7246C17.8613 17.2461 18.1348 16.8164 18.7207 16.8164L27.2949 16.8164C27.6562 16.8164 27.7344 16.5039 27.5488 16.2695L22.6562 10.0684C22.041 9.28711 21.3477 8.97461 20.3906 8.97461L17.8516 8.97461L17.8516 7.45117L20.2441 7.45117C22.3438 7.45117 22.9883 7.95898 24.3457 9.63867ZM1.72852 18.3984L1.72852 24.7656C1.72852 26.1621 2.4707 26.8848 3.83789 26.8848L25.752 26.8848C27.0898 26.8848 27.8516 26.1621 27.8516 24.7656L27.8516 18.3984L19.502 18.3984C19.2578 20.7812 17.3047 22.5293 14.7949 22.5293C12.2852 22.5293 10.3223 20.791 10.0781 18.3984Z"
          fill="white"
          fillOpacity="0.85"
        />
        <path
          d="M10.5078 10.8984C10.0586 10.8984 9.73633 11.2207 9.73633 11.6602C9.73633 11.8848 9.82422 12.0605 9.99023 12.2266L14.1699 16.2891C14.3848 16.5039 14.5703 16.5723 14.7949 16.5723C15.0098 16.5723 15.2051 16.5039 15.4102 16.2891L19.5898 12.2266C19.7559 12.0605 19.8438 11.8848 19.8438 11.6602C19.8438 11.2207 19.502 10.8984 19.0625 10.8984C18.8574 10.8984 18.6328 10.9863 18.4766 11.1621L16.3574 13.3887L14.7949 15.0293L13.2227 13.3887L11.1035 11.1621C10.9473 10.9863 10.7129 10.8984 10.5078 10.8984ZM14.7949 0C14.3262 0 13.9355 0.380859 13.9355 0.839844L13.9355 12.334L14.0625 15.459C14.082 15.8594 14.3945 16.1914 14.7949 16.1914C15.1953 16.1914 15.5078 15.8594 15.5273 15.459L15.6445 12.334L15.6445 0.839844C15.6445 0.380859 15.2539 0 14.7949 0Z"
          fill="white"
          fillOpacity="0.85"
        />
      </g>
    </svg>
  )
}

export { UrlInput }
