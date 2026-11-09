import { useId, useState } from 'react'
import Campo from './Campo'
import { ahoraInput, hoyInput, fechaLocalAISO, fechaHoraLocalAISO } from '../utils/fechas'

// Formulario declarativo con validación de tipo, longitud y formato.
// campo: { name, label, type, required, max, min, options, limite, validar, autoComplete, ayuda, placeholder }
// type: text | email | tel | url | password | number | textarea | select | mascota | date | datetime
const URL_REGEX = /^https?:\/\/\S+$/i

function inicialDe(c, inicial) {
  if (inicial[c.name] !== undefined && inicial[c.name] !== null) return String(inicial[c.name])
  if (c.porDefecto !== undefined) return c.porDefecto
  if (c.type === 'datetime' && c.limite === 'pasado') return ahoraInput()
  if (c.type === 'date' && c.limite === 'pasado') return hoyInput()
  if (c.type === 'select') return typeof c.options[0] === 'string' ? c.options[0] : c.options[0].valor
  return ''
}

function validarCampo(c, v, valores = {}) {
  const valor = typeof v === 'string' ? v.trim() : v
  if (!valor) return c.required ? `${c.label} es obligatorio` : ''
  if (c.max && valor.length > c.max) return `${c.label}: máximo ${c.max} caracteres`
  if (c.min && valor.length < c.min) return `${c.label}: mínimo ${c.min} caracteres`
  if (c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'Ingresa un email válido'
  if (c.type === 'tel' && !/^\+?[0-9][0-9\s\-()]{5,18}[0-9]$/.test(valor)) return 'Teléfono no válido'
  if (c.type === 'url' && !URL_REGEX.test(valor)) return 'Debe comenzar con http:// o https://'
  if (c.type === 'number') {
    const n = Number(valor)
    if (!Number.isFinite(n)) return `${c.label} debe ser un número`
    if (c.minValor !== undefined && n < c.minValor) return `${c.label} debe ser al menos ${c.minValor}`
    if (c.maxValor !== undefined && n > c.maxValor) return `${c.label} debe ser como máximo ${c.maxValor}`
  }
  if (c.type === 'date') {
    if (c.limite === 'pasado' && valor > hoyInput()) return 'La fecha no puede ser futura'
    if (c.limite === 'futuro' && valor < hoyInput()) return 'La fecha no puede ser anterior a hoy'
  }
  if (c.type === 'datetime') {
    if (c.limite === 'futuro' && new Date(valor) <= new Date()) return 'La fecha y hora deben ser posteriores a la actual'
    if (c.limite === 'pasado' && new Date(valor) > new Date()) return 'La fecha no puede ser futura'
  }
  return c.validar ? c.validar(valor, valores) || '' : ''
}

function aPayload(c, v) {
  const valor = typeof v === 'string' ? v.trim() : v
  if (!valor) return c.type === 'mascota' || c.type === 'select' ? null : valor === '' ? null : valor
  if (c.type === 'mascota') return Number(valor)
  if (c.type === 'number') return Number(valor)
  if (c.type === 'date') return fechaLocalAISO(valor)
  if (c.type === 'datetime') return fechaHoraLocalAISO(valor)
  return valor
}

export default function FormularioCampos({ campos, inicial = {}, mascotas = [], onSubmit, onCancelar, textoEnviar = 'Guardar', limpiarAlEnviar = false, className = '' }) {
  const uid = useId()
  const crearValores = () => Object.fromEntries(campos.map((c) => [c.name, inicialDe(c, inicial)]))
  const [valores, setValores] = useState(crearValores)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')
  const [exito, setExito] = useState('')

  const cambiar = (name) => (e) => {
    setValores((v) => ({ ...v, [name]: e.target.value }))
    setErrores((er) => ({ ...er, [name]: '' }))
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErrorGeneral('')
    setExito('')
    const nuevos = {}
    campos.forEach((c) => {
      const msg = validarCampo(c, valores[c.name], valores)
      if (msg) nuevos[c.name] = msg
    })
    setErrores(nuevos)
    if (Object.keys(nuevos).length) return

    setEnviando(true)
    try {
      const payload = Object.fromEntries(campos.map((c) => [c.name, aPayload(c, valores[c.name])]))
      const mensaje = await onSubmit(payload)
      if (typeof mensaje === 'string') setExito(mensaje)
      if (limpiarAlEnviar) setValores(crearValores())
    } catch (err) {
      setErrorGeneral(err.message || 'No se pudo guardar')
    } finally {
      setEnviando(false)
    }
  }

  const renderControl = (c) => {
    const id = `${uid}-${c.name}`
    const comunes = { id, value: valores[c.name], onChange: cambiar(c.name), 'aria-invalid': !!errores[c.name] }
    switch (c.type) {
      case 'textarea':
        return <textarea rows={3} maxLength={c.max} placeholder={c.placeholder} {...comunes} />
      case 'select':
        return (
          <select {...comunes}>
            {c.options.map((o) => {
              const op = typeof o === 'string' ? { valor: o, etiqueta: o } : o
              return <option key={op.valor} value={op.valor}>{op.etiqueta}</option>
            })}
          </select>
        )
      case 'mascota':
        return (
          <select {...comunes}>
            <option value="">{c.required ? 'Selecciona una mascota' : 'Sin mascota específica'}</option>
            {mascotas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        )
      case 'date':
        return <input type="date" {...(c.limite === 'pasado' ? { max: hoyInput() } : { min: hoyInput() })} {...comunes} />
      case 'datetime':
        return <input type="datetime-local" {...(c.limite === 'futuro' ? { min: ahoraInput() } : { max: ahoraInput() })} {...comunes} />
      case 'number':
        return <input type="number" step={c.step || 'any'} min={c.minValor} max={c.maxValor} placeholder={c.placeholder} {...comunes} />
      default:
        return (
          <input
            type={c.type || 'text'}
            maxLength={c.max}
            placeholder={c.placeholder}
            autoComplete={c.autoComplete}
            {...comunes}
          />
        )
    }
  }

  return (
    <form className={`form-card card ${className}`} onSubmit={enviar} noValidate>
      <div className="form-grid">
        {campos.map((c) => (
          <Campo key={c.name} id={`${uid}-${c.name}`} etiqueta={`${c.label}${c.required ? ' *' : ''}`} error={errores[c.name]} ayuda={c.ayuda}>
            {renderControl(c)}
          </Campo>
        ))}
      </div>
      {errorGeneral && <p className="alert alert-error" role="alert">{errorGeneral}</p>}
      {exito && <p className="alert alert-success" role="status">{exito}</p>}
      <div className="form-actions">
        {onCancelar && (
          <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={enviando}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Guardando...' : textoEnviar}
        </button>
      </div>
    </form>
  )
}
