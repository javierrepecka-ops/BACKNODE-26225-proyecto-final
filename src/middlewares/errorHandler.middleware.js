// Manejador global de errores
export const errorHandler = (err, req, res, next) => {
  // JSON mal formado en el body (lo lanza body-parser) -> 400
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El body no es un JSON válido" });
  }

  const status = err.status || 500;

  if (status >= 500) {
    console.error("[ERROR]", err);
  }

  res.status(status).json({
    error:
      status >= 500
        ? err.message || "Error interno del servidor"
        : err.message,
    ...(err.details && { details: err.details }),
  });
};
