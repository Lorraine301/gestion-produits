/**
 * Catégories proposées par défaut dans le formulaire.
 * L'utilisateur peut aussi créer librement de nouvelles catégories ;
 * la liste réelle des catégories existantes est récupérée depuis l'API
 * (voir ProductService.getCategories()).
 */
export const DEFAULT_PRODUCT_CATEGORIES = [
  'Électronique',
  'Vêtements',
  'Alimentation',
  'Mobilier',
  'Beauté & Hygiène',
  'Sport & Loisirs',
  'Autre',
] as const;

/** Une catégorie est une chaîne libre : l'utilisateur peut en créer de nouvelles. */
export type ProductCategory = string;

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
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Représente les données d'un produit envoyées lors d'une création ou mise à jour.
 * N'inclut pas les champs générés par le serveur (_id, createdAt, updatedAt).
 */
export type ProductInput = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;
