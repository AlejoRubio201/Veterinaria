const HttpError = require('../utils/HttpError');
const V = require('../utils/validar');
const Registro = require('../models/registro.model');
const Mascota = require('../models/mascota.model');

// Reglas por categoría. fecha: 'pasada' (hecho ya ocurrido) | 'futura' (programado)
const REGLAS = {
  cuidado: { tipos: ['Baño', 'Corte de uñas', 'Peluquería', 'Desparasitación'], fecha: 'pasada', fechaObligatoria: true },
  nota: { tipos: ['medicamento', 'animo', 'sintoma', 'apetito'], fecha: 'pasada', fechaObligatoria: true },
  alergia: { fecha: 'pasada' },
  condicion: { fecha: 'pasada' },
  recordatorio: { tipos: ['vacuna', 'desparasitacion', 'unas', 'consulta'], fecha: 'futura', fechaObligatoria: true },
  vacuna: { fecha: 'pasada', fechaObligatoria: true },
  historial: { fecha: 'pasada', fechaObligatoria: true },
  foto: { url: true, tituloOpcional: true },
};
const CATEGORIAS = Object.keys(REGLAS);
const TOLERANCIA_MS = 5 * 60 * 1000; // desfase de relojes

async function validar(categoria, body, usuarioId, actual) {
  V.exigirObjeto(body);
  const regla = REGLAS[categoria];
  const campo = (k) => (body[k] !== undefined ? body[k] : actual?.[k]);

  let mascotaId = campo('mascotaId');
  mascotaId = mascotaId === null || mascotaId === undefined || mascotaId === '' ? null : V.id(mascotaId, 'La mascota');
  if (mascotaId && !(await Mascota.obtener(mascotaId, usuarioId))) throw new HttpError(400, 'La mascota no existe');

  let fecha = V.fechaHora(
    body.fecha !== undefined ? body.fecha : actual?.fecha?.toISOString(),
    'La fecha',
    { requerido: !!regla.fechaObligatoria }
  );
  if (fecha) {
    const cambio = !actual?.fecha || fecha.getTime() !== new Date(actual.fecha).getTime();
    if (regla.fecha === 'futura' && cambio && fecha.getTime() <= Date.now()) {
      throw new HttpError(400, 'La fecha del recordatorio no puede ser anterior a la actual');
    }
    if (regla.fecha === 'pasada' && cambio && fecha.getTime() > Date.now() + TOLERANCIA_MS) {
      throw new HttpError(400, 'La fecha no puede ser futura');
    }
  } else {
    fecha = null;
  }

  return {
    categoria,
    mascotaId,
    tipo: regla.tipos ? V.enumerado(campo('tipo'), 'El tipo', regla.tipos) : null,
    titulo: V.texto(campo('titulo') ?? (regla.tituloOpcional ? 'Foto' : undefined), 'El título', { max: 120 }),
    detalle: V.texto(campo('detalle'), 'El detalle', { max: 255, requerido: false }),
    fecha,
    url: regla.url ? V.url(campo('url'), 'La URL de la foto', { requerido: true }) : null,
  };
}

function categoriaValida(valor) {
  return V.enumerado(valor, 'La categoría', CATEGORIAS);
}

const RegistroService = {
  async listar(usuarioId, query) {
    const categoria = categoriaValida(query.categoria);
    const periodo = V.enumerado(query.periodo, 'El periodo', ['proximas', 'pasadas'], { requerido: false });
    const mascotaId = query.mascotaId ? V.id(query.mascotaId, 'La mascota') : null;
    return Registro.listar(usuarioId, { categoria, mascotaId, periodo, ahora: new Date() });
  },

  async crear(usuarioId, body) {
    V.exigirObjeto(body);
    const categoria = categoriaValida(body.categoria);
    const id = await Registro.crear(usuarioId, await validar(categoria, body, usuarioId));
    return Registro.obtener(id, usuarioId);
  },

  async actualizar(id, usuarioId, body) {
    const rid = V.id(id);
    const actual = await Registro.obtener(rid, usuarioId);
    if (!actual) throw new HttpError(404, 'Registro no encontrado');
    // La categoría no se puede cambiar
    await Registro.actualizar(rid, usuarioId, await validar(actual.categoria, body, usuarioId, actual));
    return Registro.obtener(rid, usuarioId);
  },

  async eliminar(id, usuarioId) {
    if (!(await Registro.eliminar(V.id(id), usuarioId))) throw new HttpError(404, 'Registro no encontrado');
  },
};

module.exports = RegistroService;
