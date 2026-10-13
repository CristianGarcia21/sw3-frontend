import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { Cargando } from './components/Cargando'
import { Layout } from './components/layout/Layout'
import { RutaConRol } from './components/RutaConRol'
import { Bandeja } from './pages/Bandeja'
import { Categorias } from './pages/Categorias'
import { Componentes } from './pages/Componentes'
import { DetalleCaso } from './pages/DetalleCaso'
import { DetalleMiCaso } from './pages/DetalleMiCaso'
import { Inicio } from './pages/Inicio'
import { MisCasos } from './pages/MisCasos'
import { NoEncontrada } from './pages/NoEncontrada'
import { PorValidar } from './pages/PorValidar'
import { RegistrarCaso } from './pages/RegistrarCaso'
import { RUTAS } from './utils/navegacion'

// Indicadores trae Recharts, que pesa bastante: se descarga solo al entrar a esa pantalla
const Indicadores = lazy(() => import('./pages/Indicadores').then((m) => ({ default: m.Indicadores })))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />

        <Route
          path={RUTAS.registrarCaso}
          element={
            <RutaConRol roles={['SOLICITANTE']}>
              <RegistrarCaso />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.misCasos}
          element={
            <RutaConRol roles={['SOLICITANTE']}>
              <MisCasos />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.detalleMiCaso}
          element={
            <RutaConRol roles={['SOLICITANTE']}>
              <DetalleMiCaso />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.bandeja}
          element={
            <RutaConRol roles={['AGENTE', 'ADMINISTRADOR']}>
              <Bandeja />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.detalleCaso}
          element={
            <RutaConRol roles={['AGENTE', 'VALIDADOR', 'ADMINISTRADOR']}>
              <DetalleCaso />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.porValidar}
          element={
            <RutaConRol roles={['VALIDADOR']}>
              <PorValidar />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.indicadores}
          element={
            <RutaConRol roles={['ADMINISTRADOR']}>
              <Suspense fallback={<Cargando texto="Cargando indicadores…" />}>
                <Indicadores />
              </Suspense>
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.categorias}
          element={
            <RutaConRol roles={['ADMINISTRADOR']}>
              <Categorias />
            </RutaConRol>
          }
        />

        {/* Galería del sistema de diseño: no pide rol ni backend */}
        <Route path={RUTAS.componentes} element={<Componentes />} />

        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}
