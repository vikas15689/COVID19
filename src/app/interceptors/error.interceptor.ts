import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialogService: NbDialogService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      this.dialogService.open(ErrorDialogComponent, {
        context: {
          title: 'Something went wrong! ',
          body: 'Status : ' + err.status + ' : ' + err.message
        },
      });

      // // console.log('in  error interceptor ' + err.status);
      // if (err.status === 401) {
      //   //   console.log('this is 401 error!');
      //   // auto logout if 401 response returned from api
      //   // this.authenticationService.logout();
      //   // location.reload(true);
      // }
      // console.log(err);
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
