/**
 * Catégories disponibles pour un produit.
 * Doit rester synchronisé avec l'enum définie côté backend (Product.js).
 */
export const PRODUCT_CATEGORIES = [
  'Électronique',
  'Vêtements',
  'Alimentation',
  'Mobilier',
  'Beauté & Hygiène',
  'Sport & Loisirs',
  'Autre',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

/**
 * Représente un produit tel que renvoyé par l'API (avec son identifiant et ses dates).
 */
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: ProductCategory;
  createdAt: string;
  updatedAt: string;
}

/**
 * Représente les données d'un produit envoyées lors d'une création ou mise à jour.
 * N'inclut pas les champs générés par le serveur (_id, createdAt, updatedAt).
 */
export type ProductInput = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;
