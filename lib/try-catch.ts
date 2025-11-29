import { fail, ok } from './result'

async function tryCatch<V>(promise: Promise<V>) {
  try {
    return ok(await promise)
  } catch (err) {
    return fail(err instanceof Error ? err.message : String(err))
  }
}

export { tryCatch }
