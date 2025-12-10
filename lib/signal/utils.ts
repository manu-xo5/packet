import { Signal } from '@preact/signals-react'
import { produce } from 'immer'

function update$<T>(signal$: Signal<T>, updater: (draft: T) => void) {
  signal$.value = produce(signal$.peek(), updater)
}

export { update$ }
