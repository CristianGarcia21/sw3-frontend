import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import { UsuarioActualProvider } from './context/UsuarioActualProvider.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UsuarioActualProvider>
        <App />
      </UsuarioActualProvider>
    </BrowserRouter>
  </StrictMode>,
)
