import { useCallback, useEffect, useState } from 'react'

// Carga datos con estados explícitos: cargando / error / data. `recargar()` vuelve a pedir.
export function useAsync(fn, deps = []) {
  const [estado, setEstado] = useState({ data: null, error: null, cargando: true })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let activo = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado((s) => ({ ...s, cargando: true, error: null }))
    fn()
      .then((data) => activo && setEstado({ data, error: null, cargando: false }))
      .catch((e) => activo && setEstado({ data: null, error: e.message || 'Error inesperado', cargando: false }))
    return () => {
      activo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version])

  const recargar = useCallback(() => setVersion((v) => v + 1), [])
  return { ...estado, recargar }
}
