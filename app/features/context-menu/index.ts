async function createContextMenu() {
  const menuId = await window.contextMenu.create({})

  return {
    show: () => window.contextMenu.show(menuId),
  }
}

export { createContextMenu }
