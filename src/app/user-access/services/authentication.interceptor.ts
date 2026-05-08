
import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('token');

  const isAuthRoute =
    request.url.includes('/sign-in') ||
    request.url.includes('/sign-up') ||
    request.url.includes('/users');

  const handledRequest =
    token && !isAuthRoute
      ? request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) })
      : request;

  return next(handledRequest);
};
