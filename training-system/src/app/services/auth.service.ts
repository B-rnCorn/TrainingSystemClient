import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user";
import {Observable} from "rxjs";
import {AuthUser} from "../models/authUser";
import {CONSTANTS} from "../constants/utils";
import {API} from '../constants/API';
import {MessageResponse} from "../models/messageResponse";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(userData: User): Observable<any> {
    let user = AuthService.convertUserForLogin(userData);
    return this.http.post<AuthUser>(API.LOGIN, user, httpOptions);
  }

  register(userData: User): Observable<MessageResponse> {
    let user = AuthService.convertUserForRegistration(userData);
    return this.http.post<MessageResponse>(API.REGISTER, user, httpOptions);
  }

  //TODO: Вынестив отдельный сервис
  private static convertUserForRegistration(user: User): any {
    return {
      username: user.login,
      password: user.password,
      fio: user.name,
      role: user.role,
    }
  }

  private static convertUserForLogin(user: User): any {
    return {
      username: user.login,
      password: user.password,
    }
  }
}
