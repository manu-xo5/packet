import fetchWithCookie from 'fetch-cookie'
import { CookieJar, type Store } from 'tough-cookie'

export type FetcherResponse = {
  headers: Record<string, string>
  text: string
  status: number
  statusText: string
  url: string
}

async function serializeResponse(r: Response) {
  const response: FetcherResponse = {
    headers: Object.fromEntries(r.headers.entries()),
    text: await r.text(),
    status: r.status,
    statusText: r.statusText,
    url: r.url,
  }

  return response
}

async function serializeError(err: unknown) {
  const errorObj = err instanceof Error ? err : new Error(String(err).substring('Error:'.length))

  return {
    ok: false,
    error: {
      name: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack,
      cause: errorObj.cause,
    },
  } as const
}

type Opts = {
  storage: Store
}

function createFetcher({ storage }: Opts) {
  const cookieJar = new CookieJar(storage)
  const fetch_client = fetchWithCookie(globalThis.fetch, cookieJar)

  return async function fetchClient(...args: Parameters<typeof fetch_client>) {
    try {
      const res = await fetch_client(...args)

      if (!res.ok) {
        const err = new Error(res.statusText)
        return serializeError(err)
      }

      const serializable = await serializeResponse(res)

      return {
        ok: true,
        value: serializable,
      } as const
    } catch (err) {
      return serializeError(err)
    }
  }
}

type Fetcher = ReturnType<typeof createFetcher>

export { createFetcher, type Fetcher }
