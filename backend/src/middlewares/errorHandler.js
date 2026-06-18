/**
 * Middleware centralisé de gestion des erreurs.
 * Transforme les erreurs Mongoose et applicatives en réponses JSON cohérentes,
 * pour éviter de dupliquer la logique de gestion d'erreurs dans chaque controller.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur serveur';

  // Id MongoDB mal formé (ex: /api/products/123-invalide)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Identifiant invalide : ${err.value}`;
  }

  // Erreurs de validation du schéma Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Violation de contrainte d'unicité
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Cette ressource existe déjà';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
