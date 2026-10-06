export function errorHandler(err, req, res, next) {
  // No registrar imágenes ni datos personales; solo metadatos mínimos.
  const status = err.status || 400;
  res.status(status).json({ error: err.message || 'Error interno' });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Recurso no encontrado' });
}
