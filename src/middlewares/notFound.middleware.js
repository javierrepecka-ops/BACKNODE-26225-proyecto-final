// Middleware para rutas no definidas -> 404
export const notFound = (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    method: req.method,
    path: req.originalUrl,
  });
};
