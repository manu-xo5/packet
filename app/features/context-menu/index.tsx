import { useAsyncEffect } from '@/app/hooks/useAsyncEffect'
import { useStableCallback } from '@/app/hooks/useStableCallback'
import { useSignal, useSignalEffect } from '@preact/signals-react'
import { createContext, use, useEffect } from 'react'

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

  useEffect(() => {
    let isMounted = true
    let menuId: string | undefined

    const cleanup = () => {
      if (!menuId) return
      window.contextMenu.remove({ menuId: menuId })
    }

    ;(async () => {
      const menuId = await window.contextMenu.create({})

      electronMenu.value = {
        id: menuId,
      }

      if (!isMounted) {
        cleanup()
      }
    })()

    return () => {
      isMounted = false
    }
  }, [electronMenu])

  useSignalEffect(() => {
    const handleRightClick = () => {
      const menuId = electronMenu.value?.id

      if (!menuId) return

      window.contextMenu.show(menuId)
    }

    const elt = document.getElementById(htmlFor)
    if (!elt) return

    elt.addEventListener('contextmenu', handleRightClick)
    return () => elt.removeEventListener('contextmenu', handleRightClick)
  })

  if (!electronMenu.value) {
    return null
  }

  return <MenuContextCtx.Provider value={electronMenu.value}>{children}</MenuContextCtx.Provider>
}

function MenuContextItem({ label, onClick }: { label: string; onClick?: () => void }) {
  const menuCtx = useMenuContextCtx()

  const onClickRef = useStableCallback(onClick)

  useAsyncEffect(() => {
    return (async () => {
      const menuId = menuCtx.id

      const id = await window.contextMenu.appendItem({
        menuId: menuCtx.id,
        label: label,
      })

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
      }
    })()
  }, [label, menuCtx.id, onClickRef])

  return null
}

const MenuContext = {
  Root: MenuContextRoot,
  Item: MenuContextItem,
}

export { MenuContext }
