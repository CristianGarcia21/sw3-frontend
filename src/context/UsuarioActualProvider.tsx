import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ApiError, guardarUsuario, leerUsuarioGuardado } from '../api/client'
import { listarUsuarios } from '../api/usuarios'
import type { Usuario } from '../types'
import { UsuarioActualContext } from './UsuarioActualContext'

export function UsuarioActualProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuarioId, setUsuarioId] = useState<number | null>(leerUsuarioGuardado)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let cancelado = false
    listarUsuarios()
      .then((lista) => {
        if (cancelado) return
        setUsuarios(lista)
        setError(null)
      })
      .catch((e: unknown) => {
        if (cancelado) return
        setError(e instanceof ApiError ? e : new ApiError(0, 'ERROR_INTERNO', 'No se pudo cargar la lista de usuarios'))
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })
    return () => {
      cancelado = true
    }
  }, [intento])

  const seleccionar = useCallback((id: number | null) => {
    guardarUsuario(id)
    setUsuarioId(id)
  }, [])

  const recargar = useCallback(() => {
    setCargando(true)
    setIntento((n) => n + 1)
  }, [])

  // Si el usuario guardado ya no existe o está inactivo, se trata como si no hubiera usuario
  const usuario = usuarios.find((u) => u.id === usuarioId) ?? null

  const valor = useMemo(
    () => ({ usuarios, usuario, cargando, error, seleccionar, recargar }),
    [usuarios, usuario, cargando, error, seleccionar, recargar],
  )

  return <UsuarioActualContext.Provider value={valor}>{children}</UsuarioActualContext.Provider>
}
