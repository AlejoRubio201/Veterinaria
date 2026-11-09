// Misma política que el backend (utils/validar.js): el servidor es quien decide,
// pero validar aquí da respuesta inmediata al usuario.
export function validarPassword(valor) {
  if (valor.length < 8) return 'Mínimo 8 caracteres'
  if (valor.length > 72) return 'Máximo 72 caracteres'
  if (!/[a-z]/.test(valor) || !/[A-Z]/.test(valor) || !/\d/.test(valor)) {
    return 'Debe incluir mayúscula, minúscula y número'
  }
  return ''
}
