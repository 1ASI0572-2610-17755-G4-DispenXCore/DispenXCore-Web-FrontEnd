import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('token');

  const isPublicRoute =
    request.url.includes('/auth/login') || request.url.includes('/auth/register');

  const handledRequest =
    token && !isPublicRoute
      ? request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) })
      : request;

  return next(handledRequest);
};
