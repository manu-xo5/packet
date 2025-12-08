import { useAsyncEffect } from '@/app/hooks/useAsyncEffect'
import { useStableCallback } from '@/app/hooks/useStableCallback'
import { Signal, useSignal } from '@preact/signals-react'
import { createContext, use, useEffect, useMemo } from 'react'

type C = Record<MenuId, { items: { itemId: string; label: string; subMenuId?: MenuId }[] }>
const CCtx = createContext<[MenuId, Signal<C>] | undefined>(undefined)

const useCCtx = () => {
  const ctx = use(CCtx)
  if (ctx == null) {
    throw new Error("useMenuContextCtx can't be used outside of MenuContextCtx")
  }

  return ctx
}

type MenuId = string

function MenuContextRoot({ htmlFor, children }) {
  const menuId = useMemo(() => 'root', [])
  const c$ = useSignal<C>({
    [menuId]: {
      items: [],
    },
  })

  useEffect(() => {
    const handleRightClick = () => {
      window.contextMenu.render(c$.value)
    }
    const elt = document.getElementById(htmlFor)
    elt?.addEventListener('contextmenu', handleRightClick)

    return () => {
      elt?.removeEventListener('contextmenu', handleRightClick)
    }
  }, [c$.value, htmlFor])

  return <CCtx.Provider value={[menuId, c$]}>{children}</CCtx.Provider>
}

function MenuContextItem({
  label,
  onClick,
  children,
}: {
  label: string
  icon?: string
  onClick?: () => void
  children?: React.ReactNode
}) {
  const itemId = useMemo(() => window.crypto.randomUUID(), [])
  const subMenuId = useMemo(() => (children != null ? window.crypto.randomUUID() : undefined), [children])

  const [parentMenuId, c$] = useCCtx()

  const onClickRef = useStableCallback(onClick)

  useEffect(() => {
    if (!(parentMenuId in c$.peek())) {
      c$.value = {
        ...c$.peek(),
        [parentMenuId]: {
          items: [],
        },
      }
    }

    const parentMenu = c$.peek()[parentMenuId]

    c$.value = {
      ...c$.peek(),
      [parentMenuId]: {
        ...parentMenu,
        items: [
          ...c$.peek()[parentMenuId].items,
          {
            itemId,
            label,
            subMenuId,
          },
        ],
      },
    }

    if (subMenuId && !(subMenuId in c$.peek())) {
      c$.value = {
        ...c$.peek(),
        [subMenuId]: {
          items: [],
        },
      }
    }

    return () => {
      if (parentMenuId && parentMenuId in c$.peek()) {
        c$.value = {
          ...c$.peek(),
          [parentMenuId]: {
            ...c$.peek()[parentMenuId],
            items: c$.peek()[parentMenuId].items.filter((i) => i.itemId !== itemId),
          },
        }
      }

      if (subMenuId && subMenuId in c$.peek()) {
        const newC = c$.peek()
        delete newC[subMenuId]

        c$.value = newC
      }
    }
  }, [c$, parentMenuId, children, itemId, label, subMenuId])

  useAsyncEffect(() => {
    return (async () => {
      const unsub = window.contextMenu.onClickedItem((ev) => {
        if (ev.itemId !== itemId) return
        onClickRef?.()
      })

      return () => void unsub()
    })()
  }, [itemId, onClickRef])

  return <CCtx.Provider value={[subMenuId || parentMenuId, c$]}>{children}</CCtx.Provider>
}

const MenuContext = {
  Root: MenuContextRoot,
  Item: MenuContextItem,
}

export { MenuContext }
