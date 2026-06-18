import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/**
 * Service léger de notifications "toast".
 * Permet à n'importe quel composant de signaler le résultat d'une action
 * (succès ou erreur) sans avoir à gérer son propre état d'affichage.
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'success'): void {
    const id = this.nextId++;
    this.toasts.update((current) => [...current, { id, message, type }]);

    // Disparition automatique après 3.5 secondes
    setTimeout(() => this.dismiss(id), 3500);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
