import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { SignUpRequest } from '../../../user-access/model/request/sign-up.request';
import { Authentication } from '../../../user-access/services/authentication.service';
import { LanguageSwitcherComponent } from '../../../shared/components/language-swichter/language-switcher.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    TranslateModule,
    LanguageSwitcherComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent {
  signUpForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Authentication);
  private notification = inject(NotificationService);
  private translate = inject(TranslateService);

  constructor() {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      terms: [false, Validators.requiredTrue],
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid && !this.isLoading) {
      this.isLoading = true;
      const { firstName, lastName, email, password } = this.signUpForm.value;

      this.auth.signUp(new SignUpRequest(firstName, lastName, email, password)).subscribe({
        next: () => {
          this.isLoading = false;
          this.notification.showSuccess(this.translate.instant('sign-up.success'));
          this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          this.isLoading = false;
          this.handleError(error);
        },
      });
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  private handleError(error: any): void {
    if (error.status === 409) {
      this.notification.showError(this.translate.instant('sign-up.email-exists'));
    } else if (error.status === 400) {
      this.notification.showError(this.translate.instant('sign-up.invalid-data'));
    } else {
      this.notification.showError(this.translate.instant('sign-up.error'));
    }
  }

  get f() {
    return this.signUpForm.controls;
  }
}
