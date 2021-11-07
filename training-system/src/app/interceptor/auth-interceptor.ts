import {Injectable} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {TokenService} from "../services/token.service";
import {CONSTANTS} from "../constants/utils";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    const token = this.tokenService.getToken();
    const tokenType = this.tokenService.getTokenType();
    if (token != null) {
      authReq = req.clone({headers: req.headers.set(CONSTANTS.TOKEN_HEADER_KEY, tokenType + ' ' + token)});
    }
    return next.handle(authReq);
  }
}

export const HttpInterceptorProvider =
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true};
