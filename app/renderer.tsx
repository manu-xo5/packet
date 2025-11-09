import React from 'react'
import ReactDOM from 'react-dom/client'
import { Dashboard } from './components/dashboard'
import "./globals.css"

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
)
