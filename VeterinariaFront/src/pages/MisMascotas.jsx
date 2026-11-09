import { Link } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
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
    </div>
  )
}
