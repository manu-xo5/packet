import { cn } from '@/lib/utils'
import { RefObject, useEffect, useRef } from 'react'

type Props = {
  targetRef: RefObject<HTMLDivElement | null>
  orientation?: 'horizontal' | 'vertical'
}

export function ResizeBar({ targetRef, orientation = 'vertical' }: Props) {
  const pointerDownRef = useRef(false)

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!pointerDownRef.current) {
        return
      }

      if (orientation === 'vertical') {
        targetRef.current?.style.setProperty('width', e.clientX + 'px')
      } else if (orientation === 'horizontal') {
        targetRef.current?.style.setProperty('height', e.clientY + 'px')
      }
    }

    const handlePointerUp = () => {
      pointerDownRef.current = false
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
        'box-content absolute translate-x-1/2 transition-opacity',
        orientation === 'vertical' && 'px-0.25 w-0.75 h-full top-0 right-0  cursor-ew-resize',
        orientation === 'horizontal' && 'py-0.25 h-0.75 w-full bottom-0 left-0 cursor-ns-resize'
      )}
      onPointerDown={() => {
        pointerDownRef.current = true
        document.body.style.setProperty('user-select', 'none')
      }}

      role="aside"
    >
      <div className="w-full h-full" />
    </div>
  )
}
