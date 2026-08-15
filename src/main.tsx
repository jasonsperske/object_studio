import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Self-hosted so the app still works offline; used by the DOS theme.
import '@fontsource/vt323'
import './styles.css'

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element')

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
