/**
 *
 * keeps, stores and cleans the expired - bad smelling - cookies
 *
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type TStore = {
  cookies: string[]
}

const initialValues: TStore = {
  cookies: [],
}

const useCookieStore = create(immer((): TStore => initialValues))

export { useCookieStore }
