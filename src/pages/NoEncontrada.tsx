import { Link } from 'react-router'
import { Mensaje } from '../components/Mensaje'

export function NoEncontrada() {
  return (
    <Mensaje tipo="error" titulo="Página no encontrada">
      <Link to="/" className="font-medium text-acento underline underline-offset-2">
        Volver al inicio
      </Link>
    </Mensaje>
  )
}
