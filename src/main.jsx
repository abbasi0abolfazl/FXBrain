import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initMockApi } from '@/mock/mockServer'

// Initialize in-browser mock API for standalone Cloudflare Pages deployment
initMockApi()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
