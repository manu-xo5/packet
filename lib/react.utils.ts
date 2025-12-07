function passOnRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (ref) {
    if (typeof ref === 'function') {
      ref(value)
    } else {
      ref.current = value
    }
  }
}

export { passOnRef }
