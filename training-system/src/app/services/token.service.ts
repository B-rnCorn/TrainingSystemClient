import {Injectable} from '@angular/core';
import {CONSTANTS} from "../constants/utils";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private roles: Array<string> = [];

  constructor() {
  }

  signOut() {
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(CONSTANTS.TOKEN_KEY);
    window.sessionStorage.setItem(CONSTANTS.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(CONSTANTS.TOKEN_KEY);
  }

  public saveUsername(username: string) {
    window.sessionStorage.removeItem(CONSTANTS.USERNAME_KEY);
    window.sessionStorage.setItem(CONSTANTS.USERNAME_KEY, username);
  }

  public saveTokenType(type: string) {
    window.sessionStorage.removeItem(CONSTANTS.TOKEN_TYPE_KEY);
    window.sessionStorage.setItem(CONSTANTS.TOKEN_TYPE_KEY, type);
  }

  public getTokenType(): string | null {
    return sessionStorage.getItem(CONSTANTS.TOKEN_TYPE_KEY);
  }

  public getUsername(): string | null {
    return sessionStorage.getItem(CONSTANTS.USERNAME_KEY);
  }

  public saveAuthorities(authorities: string[]) {
    console.log('saveAuthorities');
    console.log(authorities);
    window.sessionStorage.removeItem(CONSTANTS.AUTHORITIES_KEY);
    window.sessionStorage.setItem(CONSTANTS.AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];

    if (sessionStorage.getItem(CONSTANTS.TOKEN_KEY)) {
      console.log('test');
      console.log(sessionStorage.getItem(CONSTANTS.AUTHORITIES_KEY));
      JSON.parse(<string>sessionStorage.getItem(CONSTANTS.AUTHORITIES_KEY)).forEach((authority: string) => {
        this.roles.push(authority);
      });
    }

    return this.roles;
  }
}
