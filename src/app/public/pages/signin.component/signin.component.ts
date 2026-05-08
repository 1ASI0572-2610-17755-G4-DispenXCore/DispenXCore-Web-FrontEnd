import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Authentication } from '../../../user-access/services/authentication.service';
import { SignInRequest } from '../../../user-access/model/request/sign-in.request';
import { LanguageSwitcherComponent } from '../../../shared/components/language-swichter/language-switcher.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    LanguageSwitcherComponent,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SignInComponent {
  loginForm: FormGroup;
  hidePassword = true;

  private auth = inject(Authentication);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.auth.signIn(new SignInRequest(email, password));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get f() {
    return this.loginForm?.controls || {};
  }
}
