import { Link } from 'react-router'
import { Mensaje } from '../components/Mensaje'

export function NoEncontrada() {
  return (
    <Mensaje tipo="error" titulo="Página no encontrada">
      <Link to="/" className="underline">
        Volver al inicio
      </Link>
    </Mensaje>
  )
}
