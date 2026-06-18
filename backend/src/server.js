require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// On se connecte à la base de données avant de démarrer le serveur,
// afin d'éviter de répondre à des requêtes sans accès aux données.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});
