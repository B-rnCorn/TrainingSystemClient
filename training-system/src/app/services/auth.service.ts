import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user";
import {Observable} from "rxjs";
import {AuthUser} from "../models/authUser";
import {CONSTANTS} from "../constants/utils";
import {API} from "../constants/API";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: User): Observable<AuthUser> {
    return this.http.post<AuthUser>(API.LOGIN, credentials, httpOptions);
  }

  register(userInfo: User): Observable<string> {
    let user = AuthService.convertUserForRegistration(userInfo);
    return this.http.post<string>(API.REGISTER, user, httpOptions);
  }

  //TODO: Вынестив отдельный сервис
  private static convertUserForRegistration(user: User): any {
    return {
      username: user.login,
      password: user.password,
      fio: user.name,
      role: 'student'
    }
  }
}
