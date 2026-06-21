import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';

/** Valeur spéciale utilisée dans le select pour déclencher la création d'une nouvelle catégorie */
export const NEW_CATEGORY_OPTION = '__new__';

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

  readonly NEW_CATEGORY_OPTION = NEW_CATEGORY_OPTION;
  readonly categories = this.productService.categories;

  readonly productId = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly isLoading = signal(false);
  readonly isCreatingCategory = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required]],
    newCategory: [''],
    imageUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
  });

  get isEditMode(): boolean {
    return this.productId() !== null;
  }

  ngOnInit(): void {
    // Charge les catégories existantes depuis l’API
    this.productService.getCategories().subscribe();

    const id = this.route.snapshot.paramMap.get('id');
    this.productId.set(id);

    if (id) {
      this.loadProduct(id);
    }
  }

  /**
   * Réagit au changement de catégorie dans le select.
   * Si l’utilisateur choisit "+ Ajouter une nouvelle catégorie",
   * on affiche un champ texte libre.
   */
  onCategoryChange(value: string): void {
    if (value === NEW_CATEGORY_OPTION) {
      this.isCreatingCategory.set(true);

      this.form.patchValue({
        category: '',
        newCategory: '',
      });

      this.form
        .get('newCategory')
        ?.setValidators([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
        ]);
    } else {
      this.isCreatingCategory.set(false);

      this.form.get('newCategory')?.clearValidators();

      this.form.patchValue({
        category: value,
        newCategory: '',
      });
    }

    this.form.get('newCategory')?.updateValueAndValidity();
  }

  /**
   * Annule la création d'une nouvelle catégorie
   * et revient au select classique.
   */
  cancelNewCategory(): void {
    this.isCreatingCategory.set(false);

    this.form.get('newCategory')?.clearValidators();
    this.form.get('newCategory')?.updateValueAndValidity();

    this.form.patchValue({
      category: '',
      newCategory: '',
    });
  }

  /**
   * Charge un produit existant pour l’édition
   */
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
          imageUrl: product.imageUrl ?? '',
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

  /**
   * Soumission du formulaire
   */
  onSubmit(): void {
    const value = this.form.getRawValue();

    // Si on crée une nouvelle catégorie,
    // on la copie dans le champ category AVANT validation
    if (this.isCreatingCategory()) {
      const finalCategory = value.newCategory.trim();

      if (finalCategory) {
        this.form.patchValue({
          category: finalCategory,
        });
      }
    }

    // Vérifie maintenant la validité complète
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const finalValue = this.form.getRawValue();

    const productData = {
      name: finalValue.name,
      description: finalValue.description,
      price: finalValue.price,
      quantity: finalValue.quantity,
      category: finalValue.category,
      imageUrl: finalValue.imageUrl,
    };

    const id = this.productId();

    const request = this.isEditMode
      ? this.productService.update(id!, productData)
      : this.productService.create(productData);

    request.subscribe({
      next: () => {
        // Ajouter la nouvelle catégorie localement
        // pour qu’elle apparaisse immédiatement dans la liste
        if (this.isCreatingCategory()) {
          this.productService.addLocalCategory(finalValue.category);
        }

        this.toastService.success(
          this.isEditMode
            ? 'Produit modifié avec succès'
            : 'Produit créé avec succès'
        );

        this.router.navigate(['/produits']);
      },
      error: (err) => {
        this.toastService.error(
          err.error?.message ||
            'Une erreur est survenue, veuillez réessayer'
        );

        this.isSubmitting.set(false);
      },
    });
  }

  /**
   * Vérifie si un champ est invalide
   * et a déjà été touché
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);

    return !!field && field.invalid && (field.touched || field.dirty);
  }
}