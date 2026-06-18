const mongoose = require('mongoose');

/**
 * Établit la connexion à la base de données MongoDB Atlas via Mongoose.
 * En cas d'échec, le processus est arrêté car l'application ne peut pas
 * fonctionner sans accès à la base de données.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
