import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideNativeDateAdapter } from '@angular/material/core';
import { authenticationInterceptor } from './user-access/services/authentication.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNativeDateAdapter(),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    provideTranslateService({
      lang: localStorage.getItem('app-lang') || 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
