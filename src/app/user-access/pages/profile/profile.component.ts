import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { Location } from '@angular/common';
import { User } from '../../model/entities/user.entity';
import { UserService } from '../../services/user.service';
import { Authentication } from '../../services/authentication.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user = signal<User | null>(null);
  photoPreview = signal<string>('');
  isSavingInfo = signal(false);
  isSavingPassword = signal(false);

  /** Two-step delete: false = first click (warning), true = second click (confirm) */
  deleteConfirmPending = signal(false);

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  infoForm!: FormGroup;
  passwordForm!: FormGroup;

  private userService = inject(UserService);
  private auth = inject(Authentication);
  private notification = inject(NotificationService);
  private translate = inject(TranslateService);
  private fb = inject(FormBuilder);
  private location = inject(Location);

  ngOnInit(): void {
    this._buildForms();
    this._loadUser();
  }

  // ── Init ─────────────────────────────────────────────────────────────────

  private _buildForms(): void {
    this.infoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(8)]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this._passwordMatchValidator },
    );
  }

  private _loadUser(): void {
    const id = this.userService.getCurrentUserId();
    if (!id) return;

    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    this.userService.getById(id).subscribe({
      next: (u) => {
        this.user.set(u);
        this.photoPreview.set(u.photoUrl ?? '');
        this.infoForm.patchValue({
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
        });
      },
      error: () => {
        this.translate
          .get('profile.errors.load')
          .subscribe((msg) => this.notification.showError(msg));
      },
    });

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // this.userService.getById(id).subscribe({ ... });
  }

  // ── Photo ─────────────────────────────────────────────────────────────────

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(): void {
    document.getElementById('photoInput')?.click();
  }

  // ── Save personal info ────────────────────────────────────────────────────

  onSaveInfo(): void {
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }

    const id = this.user()?.id;
    if (!id) return;

    this.isSavingInfo.set(true);

    const payload: Partial<User> = {
      ...this.infoForm.value,
      photoUrl: this.photoPreview(),
    };

    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    this.userService.updateProfile(id, payload).subscribe({
      next: (updated) => {
        this.userService.syncLocalStorage(updated);
        this.isSavingInfo.set(false);
        this.translate
          .get('profile.success.info')
          .subscribe((msg) => this.notification.showSuccess(msg));
      },
      error: () => {
        this.isSavingInfo.set(false);
        this.translate
          .get('profile.errors.save')
          .subscribe((msg) => this.notification.showError(msg));
      },
    });

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // this.userService.updateProfile(id, payload).subscribe({ ... });
  }

  onCancelInfo(): void {
    const u = this.user();
    if (!u) return;
    this.infoForm.patchValue({ firstName: u.firstName, lastName: u.lastName, email: u.email });
    this.photoPreview.set(u.photoUrl ?? '');
    this.infoForm.markAsPristine();
  }

  // ── Save password ─────────────────────────────────────────────────────────

  onSavePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const id = this.user()?.id;
    if (!id) return;

    this.isSavingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.value;

    // ── JSON-SERVER (mock) — validates currentPassword client-side ──────────
    if (this.user()?.password && currentPassword !== this.user()!.password) {
      this.isSavingPassword.set(false);
      this.translate
        .get('profile.errors.wrong-password')
        .subscribe((msg) => this.notification.showError(msg));
      return;
    }

    this.userService.updatePassword(id, currentPassword, newPassword).subscribe({
      next: () => {
        this.isSavingPassword.set(false);
        this.passwordForm.reset();
        this.translate
          .get('profile.success.password')
          .subscribe((msg) => this.notification.showSuccess(msg));
      },
      error: () => {
        this.isSavingPassword.set(false);
        this.translate
          .get('profile.errors.save')
          .subscribe((msg) => this.notification.showError(msg));
      },
    });

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // this.userService.updatePassword(id, currentPassword, newPassword).subscribe({ ... });
  }

  onCancelPassword(): void {
    this.passwordForm.reset();
  }

  // ── Delete account (two-step) ─────────────────────────────────────────────

  onDeleteAccount(): void {
    if (!this.deleteConfirmPending()) {
      // Step 1 — show warning, switch button to confirm state
      this.deleteConfirmPending.set(true);
      this.translate
        .get('profile.danger.warning')
        .subscribe((msg) => this.notification.showError(msg, 5000));
      return;
    }

    // Step 2 — user clicked "CONFIRM DELETE", proceed
    const id = this.user()?.id;
    if (!id) return;

    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    this.userService.deleteAccount(id).subscribe({
      next: () => {
        this.auth.signOut();
      },
      error: () => {
        this.deleteConfirmPending.set(false);
        this.translate
          .get('profile.errors.delete')
          .subscribe((msg) => this.notification.showError(msg));
      },
    });

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // this.userService.deleteAccount(id).subscribe({ ... });
  }

  /** Reset delete confirmation if user navigates away or clicks elsewhere */
  onCancelDelete(): void {
    this.deleteConfirmPending.set(false);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  get fi() {
    return this.infoForm?.controls ?? {};
  }

  get fp() {
    return this.passwordForm?.controls ?? {};
  }

  private _passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPwd = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return newPwd === confirm ? null : { passwordMismatch: true };
  }

  goBack(): void {
    this.location.back();
  }
}
