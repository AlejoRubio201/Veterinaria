import { Link } from 'react-router-dom'
import { ChevronRight, PawPrint } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useAsync } from '../hooks/useAsync'
import { mascotaService } from '../services/mascotaService'
import { citaService } from '../services/citaService'
import { registroService } from '../services/registroService'
import { combinarRecordatorios, iconoPorTipo } from '../utils/recordatorios'
import { formatearFechaHora, formatearFecha } from '../utils/fechas'
import Estado from '../components/Estado'
import ListItem from '../components/ListItem'

export default function Inicio() {
  const { usuario } = useAuth()
  const { data, cargando, error, recargar } = useAsync(
    () =>
      Promise.all([
        mascotaService.listar(),
        citaService.listar({ periodo: 'proximas' }),
        registroService.listar({ categoria: 'recordatorio', periodo: 'proximas' }),
      ]),
    [],
  )
  const [mascotas = [], citas = [], registros = []] = data || []
  const recordatorios = combinarRecordatorios(registros, citas)
  const conFoto = mascotas.filter((m) => m.foto).slice(0, 2)

  return (
    <div>
      <div className="hero-card card">
        <div className="hero-text">
          <h1>¡Hola, {usuario.nombre}!</h1>
          <p>Toda la salud y el bienestar de tus mascotas, en un solo lugar.</p>
        </div>
        <div className="hero-photos">
          {conFoto.map((m) => (
            <img key={m.id} src={m.foto} alt={m.nombre} />
          ))}
        </div>
      </div>

      <Estado cargando={cargando} error={error} onReintentar={recargar}>
        <div className="home-grid">
          <div className="home-col">
            <section className="card section-card">
              <div className="section-card-head">
                <h2>Próximas citas</h2>
                <Link to="/citas" className="link-more">Ver todas</Link>
              </div>
              {citas.length === 0 ? (
                <p className="empty-state">No tienes citas próximas.</p>
              ) : (
                <div className="stack-list">
                  {citas.slice(0, 2).map((c) => (
                    <ListItem
                      key={c.id}
                      tarjeta={false}
                      icono={PawPrint}
                      titulo={`${c.titulo} · ${c.mascotaNombre}`}
                      detalles={[formatearFechaHora(c.fecha), c.lugar]}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="card section-card">
              <div className="section-card-head">
                <h2>Recordatorios</h2>
                <Link to="/recordatorios" className="link-more">Ver todos</Link>
              </div>
              {recordatorios.length === 0 ? (
                <p className="empty-state">Sin recordatorios pendientes.</p>
              ) : (
                <div className="stack-list">
                  {recordatorios.slice(0, 2).map((r) => (
                    <ListItem
                      key={r.id}
                      tarjeta={false}
                      to="/recordatorios"
                      icono={iconoPorTipo[r.tipo] || PawPrint}
                      tono="warn"
                      titulo={r.titulo}
                      detalles={[formatearFecha(r.fecha)]}
                      aside={<ChevronRight size={18} className="row-chevron" />}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="home-tip card">
            <p className="home-tip-text">
              {mascotas.length === 0 ? 'Agrega tu primera mascota para empezar' : 'Una mascota feliz, es una vida mejor'}
            </p>
            <div className="home-tip-icon"><PawPrint size={26} strokeWidth={2.5} /></div>
          </div>
        </div>
      </Estado>
    </div>
  )
}
