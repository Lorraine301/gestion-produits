import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Product } from '../../../core/models/product.model';

/**
 * Page principale de l'application : affiche le catalogue de produits
 * sous forme de tableau, avec recherche par nom et filtre par catégorie.
 * Délègue la confirmation de suppression à ConfirmDialogComponent pour
 * éviter toute suppression accidentelle.
 */
@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  readonly categories = this.productService.categories;
  readonly products = this.productService.products;

  readonly isLoading = signal(true);
  readonly loadError = signal(false);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');

  // Produit en attente de suppression (affiche la boîte de confirmation si non-null)
  readonly productToDelete = signal<Product | null>(null);

  /** Liste filtrée selon le texte recherché et la catégorie sélectionnée. */
  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();

    return this.products().filter((product) => {
      const matchesSearch = !term || product.name.toLowerCase().includes(term);
      const matchesCategory = !category || product.category === category;
      return matchesSearch && matchesCategory;
    });
  });

  readonly totalStockValue = computed(() =>
    this.products().reduce((sum, p) => sum + p.price * p.quantity, 0)
  );

  readonly outOfStockCount = computed(
    () => this.products().filter((p) => p.quantity === 0).length
  );

  readonly lowStockCount = computed(
    () => this.products().filter((p) => p.quantity > 0 && p.quantity <= 5).length
  );

  ngOnInit(): void {
    this.fetchProducts();
    this.productService.getCategories().subscribe();

    const categoryParam = this.route.snapshot.queryParamMap.get('category');
    if (categoryParam) {
      this.selectedCategory.set(categoryParam);
    }
  }

  fetchProducts(): void {
    this.isLoading.set(true);
    this.loadError.set(false);

    this.productService.getAll().subscribe({
      next: () => this.isLoading.set(false),
      error: () => {
        this.isLoading.set(false);
        this.loadError.set(true);
        this.toastService.error('Impossible de charger les produits depuis le serveur');
      },
    });
  }

  requestDelete(product: Product): void {
    this.productToDelete.set(product);
  }

  cancelDelete(): void {
    this.productToDelete.set(null);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.productService.delete(product._id).subscribe({
      next: () => {
        this.toastService.success(`"${product.name}" a été supprimé`);
        this.productToDelete.set(null);
      },
      error: () => {
        this.toastService.error('La suppression a échoué, veuillez réessayer');
        this.productToDelete.set(null);
      },
    });
  }

  /** Indique si le stock d'un produit est faible, pour le mettre en évidence. */
  isLowStock(product: Product): boolean {
    return product.quantity > 0 && product.quantity <= 5;
  }

  isOutOfStock(product: Product): boolean {
    return product.quantity === 0;
  }
}
