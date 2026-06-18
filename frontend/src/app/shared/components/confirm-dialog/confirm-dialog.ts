import { Component, input, output } from '@angular/core';

/**
 * Boîte de dialogue de confirmation générique.
 * Utilisée avant toute action destructrice (ex: suppression d'un produit)
 * afin d'éviter les suppressions accidentelles.
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialogComponent {
  readonly isOpen = input.required<boolean>();
  readonly title = input('Confirmer l\'action');
  readonly message = input('Êtes-vous sûr de vouloir continuer ?');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
