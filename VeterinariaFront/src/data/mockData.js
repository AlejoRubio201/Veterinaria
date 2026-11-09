export const usuario = {
  nombre: 'Juliana',
  nombreCompleto: 'Juliana Pérez',
  email: 'juliana@email.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
}

export const mascotas = [
  {
    id: 'luna',
    nombre: 'Luna',
    especie: 'Perro',
    raza: 'Golden Retriever',
    edad: '3 años',
    peso: '25 kg',
    sexo: 'Hembra',
    fechaNacimiento: '15 ene. 2022',
    color: 'Dorado',
    descripcion:
      'Es una perrita muy cariñosa y juguetona. Le encanta pasear y jugar con pelotas.',
    foto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
  },
  {
    id: 'milo',
    nombre: 'Milo',
    especie: 'Gato',
    raza: 'Europeo',
    edad: '2 años',
    peso: '5 kg',
    sexo: 'Macho',
    fechaNacimiento: '10 mar. 2023',
    color: 'Gris atigrado',
    descripcion: 'Curioso y tranquilo, disfruta de las siestas largas junto a la ventana.',
    foto: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop',
  },
]

export const proximasCitas = [
  {
    id: 1,
    titulo: 'Revisión general',
    fecha: '25 abr. 2025 · 10:00 a. m.',
    lugar: 'Clínica Veterinaria',
    mascota: 'Luna',
    estado: 'Confirmada',
  },
  {
    id: 2,
    titulo: 'Vacunación',
    fecha: '10 may. 2025 · 09:00 a. m.',
    lugar: 'Clínica VetSalud',
    mascota: 'Milo',
    estado: 'Confirmada',
  },
  {
    id: 3,
    titulo: 'Revisión de piel',
    fecha: '22 may. 2025 · 11:30 a. m.',
    lugar: 'Dr. Gómez',
    mascota: 'Luna',
    estado: 'Pendiente',
  },
]

export const citasHistorial = [
  {
    id: 4,
    titulo: 'Consulta general',
    fecha: '10 mar. 2025',
    lugar: 'Dr. Pérez · Clínica Veterinaria',
    estado: 'Completado',
  },
]

export const recordatorios = [
  {
    id: 1,
    tipo: 'vacuna',
    titulo: 'Vacuna antirrábica - Luna',
    fecha: '20 abr. 2025',
    faltan: '2 días',
  },
  {
    id: 2,
    tipo: 'desparasitacion',
    titulo: 'Desparasitación - Milo',
    fecha: '28 abr. 2025',
    faltan: '10 días',
  },
  {
    id: 3,
    tipo: 'unas',
    titulo: 'Corte de uñas - Luna',
    fecha: '5 may. 2025',
    faltan: '17 días',
  },
  {
    id: 4,
    tipo: 'consulta',
    titulo: 'Revisión general - Luna',
    fecha: '25 abr. 2025',
    faltan: '7 días',
  },
]

export const historialMedico = [
  {
    id: 1,
    titulo: 'Consulta general',
    fecha: '10 mar. 2025',
    doctor: 'Dr. Pérez · Clínica Veterinaria',
    estado: 'Completado',
  },
  {
    id: 2,
    titulo: 'Control de peso',
    fecha: '15 feb. 2025',
    doctor: 'Dr. López · VetSalud',
    estado: 'Completado',
  },
  {
    id: 3,
    titulo: 'Revisión por alergia',
    fecha: '05 dic. 2024',
    doctor: 'Dr. Gómez · VetCare',
    estado: 'Completado',
  },
  {
    id: 4,
    titulo: 'Tratamiento por infección',
    fecha: '20 oct. 2024',
    doctor: 'Dr. Pérez · Clínica Veterinaria',
    estado: 'Completado',
  },
]

export const vacunasAplicadas = [
  { id: 1, nombre: 'Rabia', fecha: '20 ene. 2025' },
  { id: 2, nombre: 'Moquillo', fecha: '15 feb. 2025' },
  { id: 3, nombre: 'Parvovirus', fecha: '15 feb. 2025' },
  { id: 4, nombre: 'Leptospirosis', fecha: '20 ene. 2025' },
]

export const proximaVacuna = { nombre: 'Rabia', fecha: '15 abr. 2025' }

export const alergias = [
  { id: 1, nombre: 'Pollo', desde: 'Reacción cutánea · Desde 10 nov. 2024' },
  { id: 2, nombre: 'Piel', desde: 'Estornudos y ojos llorosos · Desde 15 ene. 2025' },
]

export const condicionesMedicas = [
  { id: 1, nombre: 'Displasia de cadera', estado: 'En tratamiento · Desde 20 ene. 2025' },
]

export const cuidados = [
  { id: 1, tipo: 'Baño', fecha: '10 mar. 2025', mascota: 'Luna' },
  { id: 2, tipo: 'Corte de uñas', fecha: '25 feb. 2025', mascota: 'Milo' },
  { id: 3, tipo: 'Peluquería', fecha: '10 dic. 2024', mascota: 'Luna' },
  { id: 4, tipo: 'Desparasitación', fecha: '20 oct. 2024', mascota: 'Milo' },
]

export const notas = [
  {
    id: 1,
    tipo: 'medicamento',
    titulo: 'Hoy tomó su medicamento',
    fecha: '10 abr. 2025 · 8:30 a. m.',
  },
  {
    id: 2,
    tipo: 'animo',
    titulo: 'Muy juguetona hoy',
    fecha: '05 abr. 2025 · 6:15 p. m.',
  },
  {
    id: 3,
    tipo: 'sintoma',
    titulo: 'Presentó vómito',
    fecha: '28 mar. 2025 · 9:00 a. m.',
  },
  {
    id: 4,
    tipo: 'apetito',
    titulo: 'Buen apetito',
    fecha: '20 mar. 2025 · 7:45 p. m.',
  },
]

export const galeria = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517849845537-4d257902861a?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=300&h=300&fit=crop',
]
