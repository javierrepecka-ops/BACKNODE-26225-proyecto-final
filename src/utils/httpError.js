// Error personalizado que lleva el código de estado HTTP
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    if (details) this.details = details;
  }
}

export const badRequest = (msg = "Petición inválida", details) =>
  new HttpError(400, msg, details);
export const unauthorized = (msg = "No autenticado") => new HttpError(401, msg);
export const forbidden = (msg = "Acceso denegado") => new HttpError(403, msg);
export const notFoundError = (msg = "Recurso no encontrado") =>
  new HttpError(404, msg);
export const serverError = (msg = "Error interno del servidor") =>
  new HttpError(500, msg);
