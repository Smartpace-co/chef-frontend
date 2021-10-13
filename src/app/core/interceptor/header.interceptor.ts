import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AuthService } from '@modules/auth/services/auth.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    let token = JSON.parse(sessionStorage.getItem('currentUser'))?.token
    let clonedRequest;
    if (token) {
      clonedRequest = req.clone({ headers: req.headers.append('token', token) });
    }
    else {
      return next.handle(req);

    }
    // Pass the cloned request instead of the original request to the next handle
    return next.handle(clonedRequest);
  }
}

