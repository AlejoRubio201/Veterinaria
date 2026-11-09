// Error con código HTTP para que el manejador central responda correctamente
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
module.exports = HttpError;
