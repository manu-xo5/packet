const Ok = <V>(value: V) =>
  ({
    ok: true,
    value,
  }) as const
const Err = (msg: string) =>
  ({
    ok: false,
    error: msg,
  }) as const

export { Ok, Err }
