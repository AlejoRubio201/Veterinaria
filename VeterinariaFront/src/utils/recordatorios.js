import { Syringe, PawPrint, Scissors, Stethoscope } from 'lucide-react'

export const iconoPorTipo = {
  vacuna: Syringe,
  desparasitacion: PawPrint,
  unas: Scissors,
  consulta: Stethoscope,
}

export const filtroPorTipo = {
  vacuna: 'Vacunas',
  consulta: 'Citas',
  desparasitacion: 'Otros',
  unas: 'Otros',
}

// Une recordatorios guardados + próximas citas, ordenados por fecha
export function combinarRecordatorios(registros = [], citas = []) {
  const deCitas = citas.map((c) => ({
    id: `cita-${c.id}`,
    tipo: 'consulta',
    titulo: `${c.titulo} - ${c.mascotaNombre}`,
    fecha: c.fecha,
  }))
  const deRegistros = registros.map((r) => ({
    id: `reg-${r.id}`,
    tipo: r.tipo,
    titulo: r.mascotaNombre ? `${r.titulo} - ${r.mascotaNombre}` : r.titulo,
    fecha: r.fecha,
  }))
  return [...deRegistros, ...deCitas].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
}
