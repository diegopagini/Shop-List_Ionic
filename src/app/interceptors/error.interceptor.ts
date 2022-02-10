import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpRequest,
  HttpInterceptor,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error) => {
        let errorMessage = '';
        if (error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          // backend error
          errorMessage = `Server-side error: ${error.status} ${error.message}`;
        }
        return throwError(errorMessage);
      })
    );
  }
}
