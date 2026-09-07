import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initMockApi } from '@/mock/mockServer'
import { USE_MOCK_API } from '@/config/api'

// Initialize in-browser mock API for standalone mode (default when VITE_API_URL is not set)
if (USE_MOCK_API) {
  initMockApi()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
