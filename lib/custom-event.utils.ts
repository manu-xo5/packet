export const createEvent = <T extends Record<PropertyKey, unknown> | void>(type: string) => {
  const eventSymbol = Symbol(`custom-event-${type}`)

  return {
    new: (detail: T) => new CustomEvent(type, { detail: { ...detail, symbol: eventSymbol } }),

    is: function (ev: Event): ev is CustomEvent<T> {
      return (
        ev instanceof CustomEvent &&
        ev.detail &&
        typeof ev.detail === 'object' &&
        'symbol' in ev.detail &&
        ev.detail.symbol === eventSymbol
      )
    },
    type: type,
  }
}
