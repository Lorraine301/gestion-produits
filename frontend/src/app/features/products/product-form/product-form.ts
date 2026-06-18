import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { PRODUCT_CATEGORIES } from '../../../core/models/product.model';

/**
 * Formulaire de création / édition d'un produit.
 * Le même composant gère les deux cas : s'il trouve un `id` dans l'URL,
 * il bascule en mode édition et pré-remplit le formulaire avec les
 * données existantes, sinon il reste en mode création.
 *
 * L'état (isLoading, isSubmitting, productId) est stocké dans des signals :
 * Angular fonctionne ici en mode "zoneless" (sans zone.js), donc une simple
 * propriété de classe modifiée dans un callback HTTP ne déclenche pas de
 * nouveau rendu — seul un signal le garantit.
 */
@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly categories = PRODUCT_CATEGORIES;

  readonly productId = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly isLoading = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    category: ['' as string, [Validators.required]],
  });

  get isEditMode(): boolean {
    return this.productId() !== null;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId.set(id);

    if (id) {
      this.loadProduct(id);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.productService.getById(id).subscribe({
      next: (response) => {
        const product = response?.data;
        if (!product) {
          this.toastService.error('Produit introuvable');
          this.isLoading.set(false);
          this.router.navigate(['/produits']);
          return;
        }
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          category: product.category,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Impossible de charger ce produit');
        this.isLoading.set(false);
        this.router.navigate(['/produits']);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const value = this.form.getRawValue();
    const productData = {
      ...value,
      category: value.category as (typeof this.categories)[number],
    };

    const id = this.productId();
    const request = this.isEditMode
      ? this.productService.update(id!, productData)
      : this.productService.create(productData);

    request.subscribe({
      next: () => {
        this.toastService.success(
          this.isEditMode ? 'Produit modifié avec succès' : 'Produit créé avec succès'
        );
        this.router.navigate(['/produits']);
      },
      error: (err) => {
        this.toastService.error(
          err.error?.message || 'Une erreur est survenue, veuillez réessayer'
        );
        this.isSubmitting.set(false);
      },
    });
  }

  /** Raccourci pour le template : indique si un champ est invalide et a été touché. */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && (field.touched || field.dirty);
  }
}
