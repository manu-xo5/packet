import { Fetcher } from '@/lib/fetch-class'

declare global {
  interface Window {
    fetcher: Fetcher
  }
}

export {}
