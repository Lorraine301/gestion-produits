import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DEFAULT_PRODUCT_CATEGORIES, Product, ProductInput } from '../models/product.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

/**
 * Centralise toute la communication avec l'API REST des produits.
 * Expose également un signal `products` afin que les composants restent
 * automatiquement synchronisés après chaque opération CRUD, sans avoir
 * à recharger manuellement la liste depuis chaque écran.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  /** Liste réactive des produits, tenue à jour après chaque opération. */
  readonly products = signal<Product[]>([]);

  /**
   * Catégories disponibles dans l'application : démarre avec les catégories
   * par défaut, puis se complète avec toute catégorie réellement utilisée
   * en base (y compris celles créées librement par l'utilisateur).
   */
  readonly categories = signal<string[]>([...DEFAULT_PRODUCT_CATEGORIES]);

  constructor(private readonly http: HttpClient) {}

  /** Récupère tous les produits et met à jour le signal `products`. */
  getAll(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl).pipe(
      tap((response) => this.products.set(response.data))
    );
  }

  /** Récupère un produit unique par son identifiant. */
  getById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  /** Récupère les catégories distinctes existantes en base et met à jour le signal local. */
  getCategories(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/categories`).pipe(
      tap((response) => {
        const merged = new Set([...DEFAULT_PRODUCT_CATEGORIES, ...response.data]);
        this.categories.set(Array.from(merged).sort((a, b) => a.localeCompare(b, 'fr')));
      })
    );
  }

  /** Ajoute localement une catégorie nouvellement créée (avant même le rechargement depuis l'API). */
  addLocalCategory(category: string): void {
    this.categories.update((current) =>
      current.includes(category)
        ? current
        : [...current, category].sort((a, b) => a.localeCompare(b, 'fr'))
    );
  }

  /** Crée un nouveau produit et l'ajoute à la liste locale. */
  create(product: ProductInput): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product).pipe(
      tap((response) => {
        this.products.update((current) => [response.data, ...current]);
      })
    );
  }

  /** Met à jour un produit existant et synchronise la liste locale. */
  update(id: string, product: ProductInput): Observable<ApiResponse<Product>> {
    return this.http
      .put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product)
      .pipe(
        tap((response) => {
          this.products.update((current) =>
            current.map((p) => (p._id === id ? response.data : p))
          );
        })
      );
  }

  /** Supprime un produit et le retire de la liste locale. */
  delete(id: string): Observable<ApiResponse<object>> {
    return this.http.delete<ApiResponse<object>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.products.update((current) => current.filter((p) => p._id !== id));
      })
    );
  }
}
