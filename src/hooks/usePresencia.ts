import { useEffect, useState } from 'react'

/**
 * Mantiene montado un elemento mientras dura su transición de salida.
 * `montado` dice si hay que renderizarlo y `visible` si ya debe estar en su estado final.
 */
export function usePresencia(abierto: boolean, ms = 300) {
  const [montado, setMontado] = useState(abierto)
  const [visible, setVisible] = useState(false)

  // Se ajusta durante el render para no esperar a un efecto
  if (abierto && !montado) setMontado(true)
  if (!abierto && visible) setVisible(false)

  useEffect(() => {
    if (abierto) {
      // Dos cuadros para que el navegador pinte el estado inicial antes de animar
      let segundo = 0
      const primero = requestAnimationFrame(() => {
        segundo = requestAnimationFrame(() => setVisible(true))
      })
      return () => {
        cancelAnimationFrame(primero)
        cancelAnimationFrame(segundo)
      }
    }
    const espera = setTimeout(() => setMontado(false), ms)
    return () => clearTimeout(espera)
  }, [abierto, ms])

  return { montado, visible }
}
