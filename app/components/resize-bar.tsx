import { RefObject, useEffect, useRef } from 'react'

type Props = {
  targetRef: RefObject<HTMLDivElement | null>
}

export function ResizeBar({ targetRef }: Props) {
  const pointerDownRef = useRef(false)

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!pointerDownRef.current) {
        return
      }

      targetRef.current?.style.setProperty('width', e.clientX + "px")
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
  }, [targetRef])

  return (
    <div
      className="px-0.5 w-0.75 box-content h-full opacity-0 hover:opacity-100 absolute top-0 right-0 translate-x-1/2 transition-opacity cursor-ew-resize"
      onPointerDown={() => {
        pointerDownRef.current = true
        document.body.style.setProperty('user-select', 'none')
      }}
    >
      <div className="w-full h-full bg-accent" />
    </div>
  )
}
