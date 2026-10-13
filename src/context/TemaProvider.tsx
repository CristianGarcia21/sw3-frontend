import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CLAVE_TEMA, TemaContext, type Tema } from './TemaContext'

function temaInicial(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA)
    if (guardado === 'light' || guardado === 'dark') return guardado
  } catch {
    // Sin localStorage se usa el tema del sistema
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Tema claro u oscuro. Arranca con el del sistema y recuerda lo que elija la persona */
export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.theme = tema
  }, [tema])

  const cambiar = useCallback((nuevo: Tema) => {
    try {
      localStorage.setItem(CLAVE_TEMA, nuevo)
    } catch {
      // Sin localStorage el tema funciona igual, solo no se recuerda
    }
    setTema(nuevo)
  }, [])

  const valor = useMemo(() => ({ tema, cambiar }), [tema, cambiar])

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>
}
