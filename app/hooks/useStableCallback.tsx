import { useCallback, useEffect, useRef } from 'react'

function useStableCallback<T extends (() => unknown) | undefined>(cb: T) {
  const callbackRef = useRef(cb)

  useEffect(() => {
    callbackRef.current = cb
  }, [cb])

  return useCallback(() => callbackRef.current?.(), [])
}

export { useStableCallback }
