import { Err, Ok } from './result'

async function fetcher(input: string | URL | Request, init: RequestInit) {
  const fetchRes = await window.fetcher(input, init)

  if (!fetchRes.ok) {
    return Err(fetchRes.error.message)
  }

  const res = fetchRes.value
  if (!res.ok) {
    return Err(res.statusText)
  }

  return Ok(res)
}

export { fetcher }
