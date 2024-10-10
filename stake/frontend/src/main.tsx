import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Sidebar } from '../../../src/components/Sidebar'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Sidebar>
    <App />
  </Sidebar>
)
