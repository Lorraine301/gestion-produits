/**
 * Middleware déclenché lorsqu'aucune route ne correspond à la requête.
 * Transforme l'absence de route en une erreur 404 exploitable par errorHandler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée : ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = notFound;
