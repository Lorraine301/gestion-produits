import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast';
import { ProductService } from './core/services/product.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly productService = inject(ProductService);

  readonly products = this.productService.products;
  readonly categories = this.productService.categories;

  ngOnInit(): void {
    // La sidebar a besoin de connaître les produits et catégories dès le
    // démarrage de l'application, indépendamment de la page affichée.
    this.productService.getAll().subscribe();
    this.productService.getCategories().subscribe();
  }

  /** Nombre de produits appartenant à une catégorie donnée, utilisé dans les raccourcis de la sidebar. */
  countByCategory(category: string): number {
    return this.products().filter((p) => p.category === category).length;
  }
}
