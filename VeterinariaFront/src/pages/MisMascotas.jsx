import { Link } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
<<<<<<< HEAD
import { useAsync } from '../hooks/useAsync'
import { mascotaService } from '../services/mascotaService'
import { calcularEdad } from '../utils/fechas'
import PageHeader from '../components/PageHeader'
import Estado from '../components/Estado'
import Avatar from '../components/Avatar'

export default function MisMascotas() {
  const { data: mascotas, cargando, error, recargar } = useAsync(mascotaService.listar, [])

  return (
    <div>
      <PageHeader titulo="Mis mascotas">
        <Link to="/agregar-mascota" className="btn btn-primary"><Plus size={16} /> Agregar mascota</Link>
      </PageHeader>

      <Estado cargando={cargando} error={error} onReintentar={recargar} vacio={mascotas?.length === 0} textoVacio="Aún no has registrado mascotas.">
        <div className="pet-list">
          {mascotas?.map((m) => (
            <Link to={`/perfil/${m.id}`} key={m.id} className="card list-item">
              <Avatar src={m.foto} nombre={m.nombre} tamano={56} />
              <div className="li-body">
                <strong>{m.nombre}</strong>
                <span>{m.especie}{m.raza ? ` · ${m.raza}` : ''}</span>
                <span className="pet-row-meta">
                  {calcularEdad(m.fechaNacimiento)}{m.pesoKg ? ` · ${m.pesoKg} kg` : ''}
                </span>
              </div>
              <ChevronRight size={20} className="row-chevron" />
            </Link>
          ))}
        </div>
      </Estado>
=======
import { mascotas } from '../data/mockData'

export default function MisMascotas() {
  return (
    <div>
      <div className="page-header">
        <h1>Mis mascotas</h1>
        <Link to="/agregar-mascota" className="btn btn-primary">
          <Plus size={16} /> Agregar mascota
        </Link>
      </div>

      <div className="pet-list">
        {mascotas.map((m) => (
          <Link to={`/perfil/${m.id}`} key={m.id} className="card pet-row">
            <img className="avatar" src={m.foto} alt={m.nombre} width={56} height={56} />
            <div className="pet-row-body">
              <strong>{m.nombre}</strong>
              <span>
                {m.especie} · {m.raza}
              </span>
              <span className="pet-row-meta">
                {m.edad} · {m.peso}
              </span>
            </div>
            <ChevronRight size={20} className="pet-row-chevron" />
          </Link>
        ))}
      </div>

      <style>{`
        .pet-list { display: flex; flex-direction: column; gap: 14px; max-width: 520px; }
        .pet-row { display: flex; align-items: center; gap: 14px; padding: 16px 18px; transition: box-shadow .15s ease, transform .15s ease; }
        .pet-row:hover { box-shadow: var(--shadow-pop); transform: translateY(-1px); }
        .pet-row-body { display: flex; flex-direction: column; flex: 1; }
        .pet-row-body strong { font-size: 16px; font-weight: 800; }
        .pet-row-body span { font-size: 13px; color: var(--ink-500); }
        .pet-row-meta { color: var(--ink-400) !important; margin-top: 2px; }
        .pet-row-chevron { color: var(--ink-300); }
      `}</style>
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    </div>
  )
}
