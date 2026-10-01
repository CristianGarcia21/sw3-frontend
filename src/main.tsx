import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import { AvisosProvider } from './context/AvisosProvider.tsx'
import { TemaProvider } from './context/TemaProvider.tsx'
import { UsuarioActualProvider } from './context/UsuarioActualProvider.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TemaProvider>
        <AvisosProvider>
          <UsuarioActualProvider>
            <App />
          </UsuarioActualProvider>
        </AvisosProvider>
      </TemaProvider>
    </BrowserRouter>
  </StrictMode>,
)
