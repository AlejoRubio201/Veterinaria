import { api, refrescarSesion, setAccessToken } from './api'

export const authService = {
  // Al abrir la app: intenta recuperar la sesión con la cookie del refresh token
  async restaurar() {
    try {
      const data = await refrescarSesion()
      return data.usuario
    } catch {
      return null
    }
  },
  async login({ email, password }) {
    const data = await api('/auth/login', { method: 'POST', body: { email, password }, auth: false })
    setAccessToken(data.accessToken)
    return data.usuario
  },
  async registrar(datos) {
    const data = await api('/auth/registro', { method: 'POST', body: datos, auth: false })
    setAccessToken(data.accessToken)
    return data.usuario
  },
  async logout() {
    try {
      await api('/auth/logout', { method: 'POST', auth: false })
    } finally {
      setAccessToken(null)
    }
  },
  async cambiarPassword(passwordActual, passwordNueva) {
    await api('/auth/password', { method: 'PUT', body: { passwordActual, passwordNueva } })
    setAccessToken(null)
  },
}
