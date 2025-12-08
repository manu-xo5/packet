import { cn } from '@/lib/utils'
import { RefObject, useEffect, useRef } from 'react'

type Props = {
  targetRef: RefObject<HTMLDivElement | null>
  orientation?: 'horizontal' | 'vertical'
}

export function ResizeBar({ targetRef, orientation = 'vertical' }: Props) {
  const startCtx = useRef<null | {
    mousePos: number
    dimension: number
  }>(null)

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!startCtx.current) {
        return
      }

      if (orientation === 'vertical') {
        const delta = e.clientX - startCtx.current.mousePos

        targetRef.current?.style.setProperty('width', startCtx.current.dimension + delta + 'px')
      } else if (orientation === 'horizontal') {
        const delta = e.clientY - startCtx.current.mousePos

        targetRef.current?.style.setProperty('height', startCtx.current.dimension + delta + 'px')
      }
    }

    const handlePointerUp = () => {
      startCtx.current = null
      document.body.style.removeProperty('user-select')
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [targetRef, orientation])

  return (
    <div
      className={cn(
        'box-content absolute transition-opacity z-10',
        orientation === 'vertical' && 'px-px w-0.75 h-full top-0 right-0  cursor-ew-resize translate-x-1/2',
        orientation === 'horizontal' && 'py-px h-0.75 w-full bottom-0 left-0 cursor-ns-resize translate-y-1/2'
      )}
      onPointerDown={(ev) => {
        startCtx.current =
          orientation === 'vertical'
            ? {
                mousePos: ev.clientX,
                dimension: targetRef.current?.clientWidth ?? 0,
              }
            : {
                mousePos: ev.clientY,
                dimension: targetRef.current?.clientHeight ?? 0,
              }
        document.body.style.setProperty('user-select', 'none')
      }}
      role="aside"
    >
      <div className="w-full h-full" />
    </div>
  )
}
