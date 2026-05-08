import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    };
    this.snackBar.open(message, '✔', config);
  }

  showError(message: string, duration: number = 3000) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    };
    this.snackBar.open(message, '✖', config);
  }

  showInfo(message: string, duration: number = 3000) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['info-snackbar'],
    };
    this.snackBar.open(message, '', config);
  }
}
