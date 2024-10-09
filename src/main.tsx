import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './App.tsx'
import './index.css'
import { Sidebar } from './components/Sidebar/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sidebar>
      <App />
    </Sidebar>
  </React.StrictMode>,
)
