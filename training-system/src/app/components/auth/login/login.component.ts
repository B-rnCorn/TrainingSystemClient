import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user";
import {CONSTANTS} from "../../../constants/utils";
import {AuthService} from "../../../services/auth.service";
import {Token} from "@angular/compiler";
import {TokenService} from "../../../services/token.service";
import {AuthUser} from "../../../models/authUser";
import {API} from "../../../constants/API";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  _loginForm: FormGroup = new FormGroup({
    "email": new FormControl("",
      [Validators.required/*,
        Validators.email*/]),
    "password": new FormControl("",
      [Validators.required]),
  });

  private user: any;
  private loggedUser: any;

  constructor(private authService: AuthService, private tokenService: TokenService) {
  }

  ngOnInit(): void {
  }

  //TODO: доделать аналогино регистрации
  onSubmit(event: any) {
    console.log(event);
    if (!this._loginForm.invalid) {
      this.user = new User(
        '',
        this._loginForm.value['email'],
        this._loginForm.value['password'],
        '',
        CONSTANTS.EMPTY
      )
      console.log(this.user);
      let subscription = this.authService.login(this.user).subscribe(res => {
        this.loggedUser = new AuthUser(new User(res.fio, res.username, '', '', res.id), res.role, res.token, res.type);
        this.tokenService.saveAuthorities(res.role);
        this.tokenService.saveToken(res.token);
        this.tokenService.saveUsername(res.username);
        this.tokenService.saveTokenType(res.type);
        subscription.unsubscribe();
      })
    }
  }

}
