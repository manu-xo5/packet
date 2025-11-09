import { Fetcher } from '../main/main'

declare global {
  interface Window {
    fetcher: Fetcher
  }
}

export {}
