const mongoose = require('mongoose');

/**
 * Schéma du produit.
 * Représente les informations essentielles d'un produit géré par l'application :
 * nom, description, prix, quantité en stock et catégorie.
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est obligatoire'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    price: {
      type: Number,
      required: [true, 'Le prix est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    quantity: {
      type: Number,
      required: [true, 'La quantité est obligatoire'],
      min: [0, 'La quantité ne peut pas être négative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      trim: true,
      enum: {
        values: [
          'Électronique',
          'Vêtements',
          'Alimentation',
          'Mobilier',
          'Beauté & Hygiène',
          'Sport & Loisirs',
          'Autre',
        ],
        message: '{VALUE} n\'est pas une catégorie valide',
      },
    },
  },
  {
    // Ajoute automatiquement createdAt et updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
