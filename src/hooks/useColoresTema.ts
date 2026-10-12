import { useEffect, useState } from 'react'
import { useTema } from './useTema'

function leerTokens<T extends string>(tokens: readonly T[]): Record<T, string> {
  const estilos = getComputedStyle(document.documentElement)
  return Object.fromEntries(tokens.map((t) => [t, estilos.getPropertyValue(`--${t}`).trim()])) as Record<T, string>
}

/**
 * Valores reales de los tokens de color del tema actual.
 * Recharts pinta los colores como atributos del SVG, donde var(--token) no funciona en todos los navegadores;
 * por eso se leen de index.css y se vuelven a leer al cambiar de tema.
 */
export function useColoresTema<T extends string>(tokens: readonly T[]): Record<T, string> {
  const { tema } = useTema()
  const [colores, setColores] = useState(() => leerTokens(tokens))
  const clave = tokens.join('|')

  useEffect(() => {
    // Se lee en el cuadro siguiente, cuando el atributo data-theme del tema nuevo ya está puesto
    const cuadro = requestAnimationFrame(() => setColores(leerTokens(clave.split('|') as T[])))
    return () => cancelAnimationFrame(cuadro)
  }, [tema, clave])

  return colores
}
