const ok = <V>(value: V) =>
  ({
    ok: true,
    value,
  }) as const

const fail = (msg: string) =>
  ({
    ok: false,
    error: msg,
  }) as const

export { ok, fail }
