import { Err, Ok } from './result'

async function tryCatch<V>(promise: Promise<V>) {
  try {
    return Ok(await promise)
  } catch (err) {
    return Err(err instanceof Error ? err.message : String(err))
  }
}

export { tryCatch }
