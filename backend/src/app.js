const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globaux
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
  })
);
app.use(express.json());

// Désactive le cache HTTP sur l'API : sans cela, le navigateur peut renvoyer
// une réponse 304 (Not Modified) avec un corps vide sur les requêtes GET
// identiques, ce qui casse le traitement côté frontend.
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Route de vérification rapide que l'API est en ligne
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de gestion de produits opérationnelle',
  });
});

// Routes principales
app.use('/api/products', productRoutes);

// Gestion des routes inconnues et des erreurs (toujours en dernier)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
