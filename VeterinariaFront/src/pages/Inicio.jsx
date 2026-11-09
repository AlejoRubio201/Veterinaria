import { Link } from 'react-router-dom'
<<<<<<< HEAD
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

=======
import { ChevronRight, PawPrint, Syringe, Scissors } from 'lucide-react'
import { usuario, mascotas, proximasCitas, recordatorios } from '../data/mockData'

const iconoPorTipo = {
  vacuna: Syringe,
  desparasitacion: PawPrint,
  unas: Scissors,
  consulta: PawPrint,
}

export default function Inicio() {
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
  return (
    <div>
      <div className="hero-card card">
        <div className="hero-text">
          <h1>¡Hola, {usuario.nombre}!</h1>
          <p>Toda la salud y el bienestar de tus mascotas, en un solo lugar.</p>
        </div>
        <div className="hero-photos">
<<<<<<< HEAD
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
=======
          <img
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop"
            alt="Luna"
          />
          <img
            src="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=220&h=220&fit=crop"
            alt="Milo"
          />
        </div>
      </div>

      <div className="home-grid">
        <div className="home-col">
          <section className="card section-card">
            <div className="section-card-head">
              <h2>Próximas citas</h2>
              <Link to="/citas" className="link-more">
                Ver todas
              </Link>
            </div>
            <div className="stack-list">
              {proximasCitas.slice(0, 2).map((cita) => (
                <div key={cita.id} className="row-item">
                  <div className="row-item-avatar avatar-icon">
                    <PawPrint size={18} />
                  </div>
                  <div className="row-item-body">
                    <strong>{cita.titulo}</strong>
                    <span>
                      {cita.fecha}
                      <br />
                      {cita.lugar}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card section-card">
            <div className="section-card-head">
              <h2>Recordatorios</h2>
            </div>
            <div className="stack-list">
              {recordatorios.slice(0, 2).map((r) => {
                const Icon = iconoPorTipo[r.tipo] || PawPrint
                return (
                  <Link to="/recordatorios" key={r.id} className="row-item row-item-link">
                    <div className="row-item-avatar avatar-icon avatar-icon-warn">
                      <Icon size={16} />
                    </div>
                    <div className="row-item-body">
                      <strong>{r.titulo}</strong>
                      <span>{r.fecha}</span>
                    </div>
                    <ChevronRight size={18} className="row-chevron" />
                  </Link>
                )
              })}
            </div>
          </section>
        </div>

        <div className="home-tip card">
          <p className="home-tip-text">Una mascota feliz, es una vida mejor</p>
          <div className="home-tip-icon">
            <PawPrint size={26} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <style>{`
        .hero-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 32px;
          background: linear-gradient(120deg, var(--brand-50), var(--surface-0) 70%);
          margin-bottom: 20px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .hero-text h1 { margin: 0 0 6px; font-size: 26px; font-weight: 800; }
        .hero-text p { margin: 0; color: var(--ink-500); font-size: 14px; max-width: 320px; }
        .hero-photos { display: flex; align-items: flex-end; gap: -10px; }
        .hero-photos img {
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--surface-0);
          box-shadow: var(--shadow-card);
        }
        .hero-photos img:first-child { width: 110px; height: 110px; z-index: 2; }
        .hero-photos img:last-child { width: 76px; height: 76px; margin-left: -26px; }

        .home-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; align-items: start; }
        .home-col { display: flex; flex-direction: column; gap: 20px; }
        .section-card { padding: 20px 22px; }
        .section-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .section-card-head h2 { font-size: 16px; margin: 0; font-weight: 800; }
        .link-more { font-size: 13px; font-weight: 700; color: var(--brand-600); }

        .stack-list { display: flex; flex-direction: column; gap: 12px; }
        .row-item { display: flex; align-items: center; gap: 12px; }
        .row-item-link { border-radius: var(--radius-sm); padding: 4px; margin: -4px; }
        .row-item-link:hover { background: var(--surface-100); }
        .row-item-avatar { width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; }
        .avatar-icon { background: var(--brand-100); color: var(--brand-600); display: flex; align-items: center; justify-content: center; }
        .avatar-icon-warn { background: var(--warn-100); color: var(--warn-500); }
        .row-item-body { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
        .row-item-body strong { font-size: 14px; font-weight: 700; }
        .row-item-body span { font-size: 12.5px; color: var(--ink-500); line-height: 1.4; }
        .row-chevron { color: var(--ink-300); flex-shrink: 0; }

        .home-tip {
          background: linear-gradient(160deg, var(--brand-500), var(--brand-700));
          color: white;
          padding: 26px 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 200px;
        }
        .home-tip-text { font-size: 17px; font-weight: 700; line-height: 1.4; margin: 0; }
        .home-tip-icon {
          align-self: flex-end;
          width: 46px; height: 46px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center;
        }

        @media (max-width: 860px) {
          .home-grid { grid-template-columns: 1fr; }
        }
      `}</style>
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    </div>
  )
}
