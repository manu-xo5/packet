import React from 'react'
import ReactDOM from 'react-dom/client'
import { Dashboard } from './components/dashboard'
import './globals.css'
import { ProjectProvider } from './features/project/context'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <ProjectProvider>
      <Dashboard />
    </ProjectProvider>
  </React.StrictMode>
)
