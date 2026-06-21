import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list/product-list';
import { ProductFormComponent } from './features/products/product-form/product-form';
import { ProductDetailComponent } from './features/products/product-detail/product-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'produits', pathMatch: 'full' },
  { path: 'produits', component: ProductListComponent },
  { path: 'produits/nouveau', component: ProductFormComponent },
  { path: 'produits/:id/modifier', component: ProductFormComponent },
  { path: 'produits/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: 'produits' },
];
