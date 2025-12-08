import { useAsyncEffect } from '@/app/hooks/useAsyncEffect'
import { useStableCallback } from '@/app/hooks/useStableCallback'
import { useSignal, useSignalEffect } from '@preact/signals-react'
import { Children, cloneElement, createContext, isValidElement, use, useEffect } from 'react'

type TMenuContextCtx = {
  id: string
}

const MenuContextCtx = createContext<TMenuContextCtx | undefined>(undefined)

const useMenuContextCtx = () => {
  const ctx = use(MenuContextCtx)
  if (ctx == null) {
    throw new Error("useMenuContextCtx can't be used outside of MenuContextCtx")
  }

  return ctx
}

function MenuContextRoot({ htmlFor, children }) {
  const electronMenu = useSignal<TMenuContextCtx | null>(null)

  useAsyncEffect(() => {
    return (async () => {
      const menuId = await window.contextMenu.create({})

      electronMenu.value = { id: menuId }

      const handleRightClick = () => {
        window.contextMenu.show(menuId)
      }
      const elt = document.getElementById(htmlFor)
      elt?.addEventListener('contextmenu', handleRightClick)

      return () => {
        elt?.removeEventListener('contextmenu', handleRightClick)
        window.contextMenu.remove({ menuId: menuId })
      }
    })()
  }, [electronMenu, htmlFor])

  if (!electronMenu.value) {
    return null
  }

  return <MenuContextCtx.Provider value={electronMenu.value}>{children}</MenuContextCtx.Provider>
}

function MenuContextItem({
  label,
  icon,
  onClick,
  children,
}: {
  label: string
  icon?: string
  onClick?: () => void
  children?: React.ReactNode
}) {
  const menuCtx = useMenuContextCtx()
  const subMenuId$ = useSignal<string | undefined>(undefined)

  const onClickRef = useStableCallback(onClick)

  useAsyncEffect(() => {
    return (async () => {
      const menuId = menuCtx.id

      const { id, subMenuId } = await window.contextMenu.appendItem({
        menuId: menuCtx.id,
        submenu: children != null,
        label: label,
        icon: icon,
      })

      subMenuId$.value = subMenuId

      const unsub = window.contextMenu.onClickedItem((ev) => {
        if (ev.itemId !== id) return

        onClickRef?.()
      })

      return () => {
        unsub()

        window.contextMenu.removeItem({
          menuId: menuId,
          itemId: id,
        })

        if (subMenuId) {
          window.contextMenu.remove({
            menuId: subMenuId,
          })
        }
      }
    })()
  }, [icon, subMenuId$, label, menuCtx.id, onClickRef, children])

  if (!subMenuId$.value) {
    return null
  }

  return <MenuContextCtx.Provider value={{ id: subMenuId$.value }}>{children}</MenuContextCtx.Provider>
}

const MenuContext = {
  Root: MenuContextRoot,
  Item: MenuContextItem,
}

export { MenuContext }
