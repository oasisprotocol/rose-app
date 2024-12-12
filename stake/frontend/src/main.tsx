import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Sidebar } from '../../../home/src/components/Sidebar'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Sidebar>
    <App />
  </Sidebar>
)
