import {Injectable} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {TokenService} from "../services/token.service";
import {CONSTANTS} from "../constants/utils";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token: TokenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    const token = this.token.getToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(CONSTANTS.TOKEN_HEADER_KEY, token) });
    }
    return next.handle(authReq);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
