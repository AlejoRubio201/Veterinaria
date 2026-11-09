import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import { authService } from '../services/authService'
import { onSesionPerdida } from '../services/api'

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    onSesionPerdida(() => setUsuario(null))
    authService.restaurar().then((u) => {
      if (!activo) return
      setUsuario(u)
      setCargando(false)
    })
    return () => {
      activo = false
    }
  }, [])

  const login = useCallback(async (credenciales) => setUsuario(await authService.login(credenciales)), [])
  const registrar = useCallback(async (datos) => setUsuario(await authService.registrar(datos)), [])
  const logout = useCallback(async () => {
    await authService.logout().catch(() => {})
    setUsuario(null)
  }, [])
  const cambiarPassword = useCallback(async (actual, nueva) => {
    await authService.cambiarPassword(actual, nueva)
    setUsuario(null)
  }, [])

  const valor = useMemo(
    () => ({ usuario, cargando, login, registrar, logout, cambiarPassword, setUsuario }),
    [usuario, cargando, login, registrar, logout, cambiarPassword],
  )
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
