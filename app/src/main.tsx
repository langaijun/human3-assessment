import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { VersionProvider } from '@/context/VersionContext'

createRoot(document.getElementById('root')!).render(
  <VersionProvider>
    <App />
  </VersionProvider>
)
