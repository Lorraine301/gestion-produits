import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Product } from '../../../core/models/product.model';

/**
 * Page de détail en lecture seule d'un produit.
 * Accessible depuis le tableau du catalogue via l'icône "œil".
 * Permet aussi de lancer la modification ou la suppression directement
 * depuis cette vue, sans repasser par la liste.
 */
@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, ConfirmDialogComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly toastService = inject(ToastService);

  readonly product = signal<Product | null>(null);
  readonly isLoading = signal(true);
  readonly loadError = signal(false);
  readonly showDeleteConfirm = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/produits']);
      return;
    }
    this.loadProduct(id);
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.loadError.set(false);

    this.productService.getById(id).subscribe({
      next: (response) => {
        if (!response?.data) {
          this.loadError.set(true);
          this.isLoading.set(false);
          return;
        }
        this.product.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  requestDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  confirmDelete(): void {
    const product = this.product();
    if (!product) return;

    this.productService.delete(product._id).subscribe({
      next: () => {
        this.toastService.success(`"${product.name}" a été supprimé`);
        this.router.navigate(['/produits']);
      },
      error: () => {
        this.toastService.error('La suppression a échoué, veuillez réessayer');
        this.showDeleteConfirm.set(false);
      },
    });
  }

  isLowStock(product: Product): boolean {
    return product.quantity > 0 && product.quantity <= 5;
  }

  isOutOfStock(product: Product): boolean {
    return product.quantity === 0;
  }
}
