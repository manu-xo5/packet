import { useEffect } from 'react'

function useAsyncEffect(
  effect: (isMounted: () => boolean) => Promise<void | (() => void)>,
  deps: React.DependencyList
) {
  useEffect(() => {
    let isMounted = true
    let cleanup: (() => void) | void

    effect(() => isMounted).then((cleanupFn) => {
      if (isMounted) {
        cleanup = cleanupFn
      } else {
        cleanupFn?.()
      }
    })

    return () => {
      isMounted = false
      cleanup?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export { useAsyncEffect }
