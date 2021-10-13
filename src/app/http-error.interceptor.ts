import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    // To navigate login page after session timeout.
                    if (error.status === 401) {
                        window.sessionStorage.clear();
                        window.localStorage.clear();
                        this.router.navigate(['/auth/login']);
                    }
                    return throwError(error);
                })
            )
    }
}
