async function fetcher(input: string | URL | Request, init: RequestInit) {
  const fetchRes = await window.fetcher(input, init)
  return fetchRes
}

export { fetcher }
