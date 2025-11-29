import { existsSync } from 'fs'
import fs from 'fs/promises'
import { Cookie, SerializedCookie, Store } from 'tough-cookie'

type Nullable<T> = T | undefined | null

type CallbackArg<T> = [err: Error, result?: never] | [err: null, result: T]

type Callback<T> = {
  (error: Error, result?: never): void
  (error: null, result: T): void
}

function createPromiseCallback<T>(cb?: Callback<T>) {
  const { promise, resolve, reject } = Promise.withResolvers<T>()

  const callback = (...args: CallbackArg<T>) => {
    const [error, result] = args

    if (error) {
      cb?.(error)
      reject(error)
      return
    }

    cb?.(null, result)
    resolve(result)
  }

  return {
    resolve: (value: T) => {
      callback(null, value)
      return promise
    },
    reject: (err: Error) => {
      callback(err)
      return promise
    },
  }
}

class SimpleFileCookieStore extends Store {
  constructor(public filename: string) {
    super()
    this.synchronous = false
    this.filename = filename
  }

  async _read() {
    if (!existsSync(this.filename)) return []
    const text = await fs.readFile(this.filename, 'utf8')
    if (!text) return []
    return JSON.parse(text) as SerializedCookie[]
  }

  async _write(cookies: unknown) {
    await fs.writeFile(this.filename, JSON.stringify(cookies, null, 2), 'utf8')
  }

  async findCookie(
    domain: Nullable<string>,
    path: Nullable<string>,
    key: Nullable<string>,
    cb?: Callback<Cookie | undefined>
  ) {
    const cbPromise = createPromiseCallback(cb)
    const list = await this._read()
    const found = list.find((c) => c.domain === domain && c.path === path && c.key === key)

    if (!found) {
      return cbPromise.resolve(undefined)
    }

    return cbPromise.resolve(Cookie.fromJSON(found))
  }

  async findCookies(
    domain: Nullable<string>,
    path: Nullable<string>,
    _allowSpecialUseDomain?: boolean,
    cb?: Callback<Cookie[]>
  ) {
    const cbPromise = createPromiseCallback(cb)
    const list = await this._read()

    const result = list
      .filter((c) => c.domain === domain)
      .filter((c) => !path || c.path === path)
      .map((c) => Cookie.fromJSON(c))
      .filter((c) => c != null)

    return cbPromise.resolve(result)
  }

  // Add a cookie
  async putCookie(cookie: Cookie, cb?: Callback<void>) {
    const cbPromise = createPromiseCallback(cb)

    const list = await this._read()

    // Remove existing match
    const filtered = list.filter((c) => !(c.domain === cookie.domain && c.path === cookie.path && c.key === cookie.key))

    filtered.push(cookie.toJSON())

    await this._write(filtered)

    return cbPromise.resolve()
  }

  // Replace cookie (same as putCookie)
  async updateCookie(_oldCookie: Cookie, newCookie: Cookie, cb?: Callback<void>) {
    const cbPromise = createPromiseCallback(cb)

    await this.putCookie(newCookie)

    return cbPromise.resolve()
  }

  async removeCookie(domain: Nullable<string>, path: Nullable<string>, key: Nullable<string>, cb?: Callback<void>) {
    const cbPromise = createPromiseCallback(cb)

    const list = await this._read()
    const filtered = list.filter((c) => !(c.domain === domain && c.path === path && c.key === key))
    await this._write(filtered)

    return cbPromise.resolve()
  }

  async removeCookies(domain: Nullable<string>, path: Nullable<string>, cb?: Callback<void>) {
    const cbPromise = createPromiseCallback(cb)

    const list = await this._read()
    const filtered = list.filter((c) => !(c.domain === domain && (!path || c.path === path)))
    await this._write(filtered)
    return cbPromise.resolve()
  }
}

export { SimpleFileCookieStore }
