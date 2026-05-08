import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { User } from '../../model/entities/user.entity';
import { Role } from '../../model/entities/role.model';
import { AccountStatus } from '../../model/entities/accountStatus.model';

export type UserModalMode = 'add' | 'edit' | 'delete';

export interface UserModalData {
  mode: UserModalMode;
  role: Role; // Role.USER | Role.ADMIN — define el contexto del modal
  user?: User;
}

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatLabel,
    MatError
  ],
  templateUrl: './user-model.component.html',
  styleUrls: ['./user-model.component.css'],
})
export class UserModelComponent {
  @ViewChild('userForm') userForm!: NgForm;

  dialogTitle: string;
  mode: UserModalMode;
  targetRole: Role;
  user: User;

  /** Expuesto al template para ocultar/mostrar el campo password en modo edit */
  readonly isEditMode: boolean;
  readonly isDeleteMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<UserModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserModalData,
  ) {
    this.mode = data.mode;
    this.targetRole = data.role;
    this.isEditMode = this.mode === 'edit';
    this.isDeleteMode = this.mode === 'delete';

    // Si vienen datos los clonamos, si no creamos un User vacío con el role correcto
    this.user = data.user
      ? new User({ ...data.user })
      : new User({ role: this.targetRole, status: AccountStatus.INACTIVE });

    const entityLabel = this.targetRole === Role.ADMIN ? 'Admin' : 'User';
    this.dialogTitle =
      this.mode === 'add'
        ? `Add ${entityLabel}`
        : this.mode === 'edit'
          ? `Edit ${entityLabel}`
          : `Delete ${entityLabel}`;
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  /**
   * Envía los datos del formulario.
   * En modo `edit` omite el password si se dejó vacío (sin forzar cambio).
   */
  onSubmit(): void {
    if (this.userForm.valid) {
      const result: Partial<User> = {
        firstName: this.user.firstName.trim(),
        lastName: this.user.lastName.trim(),
        email: this.user.email.trim(),
        role: this.targetRole,
      };

      // Password: siempre en add; en edit solo si se escribió algo
      if (this.mode === 'add' || this.user.password) {
        result.password = this.user.password;
      }

      if (this.mode === 'edit') {
        result.id = this.user.id;
      }

      this.dialogRef.close(result);
    }
  }

  onConfirmDelete(): void {
    this.dialogRef.close(true);
  }
}
