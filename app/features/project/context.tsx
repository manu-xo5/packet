import { Signal, useComputed, useSignal } from '@preact/signals-react'
import { createContext, use } from 'react'

type Envirnoment = {
  id: string
}

const ProjectCtx = createContext<{ filepath$: Signal<string>; curEnvirnoment$: Signal<Envirnoment> } | undefined>(
  undefined
)

const useProject = () => {
  const ctx = use(ProjectCtx)

  if (!ctx) {
    throw new Error('useProject must be used within a ProjectProvider')
  }

  return ctx
}

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const filepath$ = useSignal('')
  const envirnoments$ = useSignal<{ [id: string]: Envirnoment }>({ default: { id: 'default' } })
  const curEnvirnomentId$ = useSignal<Envirnoment['id']>('default')

  const curEnvirnoment$ = useComputed(() => {
    return envirnoments$.value[curEnvirnomentId$.value]
  })

  return <ProjectCtx.Provider value={{ filepath$, curEnvirnoment$ }}>{children}</ProjectCtx.Provider>
}

export { ProjectProvider, useProject }
