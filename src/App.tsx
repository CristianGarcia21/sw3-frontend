import { Route, Routes } from 'react-router'
import { Layout } from './components/layout/Layout'
import { RutaConRol } from './components/RutaConRol'
import { EnConstruccion } from './pages/EnConstruccion'
import { Inicio } from './pages/Inicio'
import { NoEncontrada } from './pages/NoEncontrada'
import { RUTAS } from './utils/navegacion'

// Cada tarea reemplaza su <EnConstruccion> por la pantalla real
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />

        <Route
          path={RUTAS.registrarCaso}
          element={
            <RutaConRol roles={['SOLICITANTE']}>
              <EnConstruccion titulo="Registrar caso" issue="HU-01 · #7" />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.misCasos}
          element={
            <RutaConRol roles={['SOLICITANTE']}>
              <EnConstruccion titulo="Mis casos" issue="HU-02 · #12" />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.detalleMiCaso}
          element={
            <RutaConRol roles={['SOLICITANTE']}>
              <EnConstruccion titulo="Detalle de mi caso" issue="HU-12 · #55" />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.bandeja}
          element={
            <RutaConRol roles={['AGENTE', 'ADMINISTRADOR']}>
              <EnConstruccion titulo="Bandeja de casos" issue="HU-03 · #16" />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.detalleCaso}
          element={
            <RutaConRol roles={['AGENTE', 'VALIDADOR', 'ADMINISTRADOR']}>
              <EnConstruccion titulo="Detalle del caso" issue="HU-05 · #21" />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.porValidar}
          element={
            <RutaConRol roles={['VALIDADOR']}>
              <EnConstruccion titulo="Casos por validar" issue="HU-07 · #34" />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.indicadores}
          element={
            <RutaConRol roles={['ADMINISTRADOR']}>
              <EnConstruccion titulo="Indicadores" issue="HU-10 · #46" />
            </RutaConRol>
          }
        />
        <Route
          path={RUTAS.categorias}
          element={
            <RutaConRol roles={['ADMINISTRADOR']}>
              <EnConstruccion titulo="Categorías" issue="HU-11 · #51" />
            </RutaConRol>
          }
        />

        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}
