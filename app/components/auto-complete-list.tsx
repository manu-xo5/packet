import { setInputValue } from '@/lib/event.utils'
import { cn } from '@/lib/utils'
import { Activity, useEffect, useEffectEvent, useRef, useState } from 'react'
import { HEADERS } from '../data/headers'

function AutoCompleteList({ htmlFor, offset = 0 }: { offset?: number; htmlFor: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [top, setTop] = useState(0)
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState('')
  const scrollAnimationFrame = useRef<number>(0)

  const filteredHeaders = HEADERS.filter((header) => header.toLowerCase().includes(input.toLowerCase()))
  const filteredHeadersRef = useRef(filteredHeaders)
  filteredHeadersRef.current = filteredHeaders

  const calcTop = ({ elem, offset }: { elem: HTMLElement; offset: number }) => {
    const rect = elem.getBoundingClientRect()

    setTop(rect.top + rect.height + offset)
  }

  const handleInput = useEffectEvent((inputValue: string) => {
    const first = HEADERS.filter((header) => header.toLowerCase().includes(inputValue.toLowerCase())).at(0)

    if (first) {
      setSelected(first)
    }
    setInput(inputValue)
  })

  const handleNavigate = useEffectEvent((direction: 'next' | 'prev') => {
    const selectedIndex = filteredHeaders.indexOf(selected)

    if (direction === 'prev') {
      const i = Math.max(0, selectedIndex - 1)
      setSelected(filteredHeadersRef.current[i])
    } else if (direction === 'next') {
      const i = Math.min(filteredHeadersRef.current.length - 1, selectedIndex + 1)
      setSelected(filteredHeadersRef.current[i])
    }

    window.cancelAnimationFrame(scrollAnimationFrame.current)
    scrollAnimationFrame.current = window.requestAnimationFrame(() => {
      const selectedLiElem = document.querySelector(`[data-state="selected"]`)
      if (selectedLiElem) {
        selectedLiElem.scrollIntoView({ behavior: 'instant', block: 'nearest' })
      }
    })
  })

  const handleAccept = useEffectEvent(() => {
    const elem = document.getElementById(htmlFor)

    if (!selected) return
    if (!(elem instanceof HTMLInputElement)) return

    setInputValue(elem, selected)
    setIsOpen(false)
  })

  useEffect(() => {
    const abortCtrl = new AbortController()
    const elem = document.getElementById(htmlFor)

    if (!elem) return
    if (!(elem instanceof HTMLInputElement)) return

    handleInput(elem.value)
    calcTop({ elem, offset })

    elem?.addEventListener('focus', () => {
      calcTop({ elem, offset })
      setIsOpen(true)
    })

    elem?.addEventListener('input', (ev) => {
      if (!(ev.currentTarget instanceof HTMLInputElement)) return

      handleInput(ev.currentTarget.value)
    })

    elem?.addEventListener('blur', () => setIsOpen(false))

    elem?.addEventListener(
      'keydown',
      (ev) => {
        if (ev.ctrlKey && ev.key === 'n') {
          ev.preventDefault()
          handleNavigate('next')
          return
        }

        if (ev.ctrlKey && ev.key === 'p') {
          ev.preventDefault()
          handleNavigate('prev')
          return
        }

        if (ev.ctrlKey && ev.key === ' ') {
          ev.preventDefault()
          setIsOpen(true)
          return
        }

        if (ev.key === 'Enter' || (ev.ctrlKey && ev.key === 'y')) {
          ev.preventDefault()
          handleAccept()
          return
        }

        if (ev.key === 'Escape') {
          ev.preventDefault()
          setIsOpen(false)
        }
      },
      { signal: abortCtrl.signal }
    )

    return () => {
      abortCtrl.abort()
    }
  }, [htmlFor, offset])

  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <div style={{ top: top + 'px' }} className="bg-secondary rounded-md overflow-auto absolute py-3 shadow">
        <ul className="h-full overflow-auto px-3 w-72 max-h-56">
          {filteredHeaders.map((header) => (
            <li
              key={header}
              className={cn('block px-3 py-1 rounded', selected === header && 'bg-primary')}
              data-state={selected === header ? 'selected' : 'not-selected'}
            >
              {header}
            </li>
          ))}
        </ul>
      </div>
    </Activity>
  )
}

export { AutoCompleteList }
