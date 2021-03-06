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
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent, DialogData} from "../../dialog/add-delete-students-dialog/dialog.component";
import {StudentSnackBarComponent} from "../../snack-bar/student-snack-bar/student-snack-bar.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  message: string;

  _loginForm: FormGroup = new FormGroup({
    "email": new FormControl("",
      [Validators.required/*,
        Validators.email*/]),
    "password": new FormControl("",
      [Validators.required]),
  });

  private user: any;
  private loggedUser: any;

  constructor(private authService: AuthService, private tokenService: TokenService,
              private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar) {
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
        this.router.navigate(['task-view']);
      },
        error => {
          if (error.status === 'ERR_CONNECTION_REFUSED') {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: 'Отсутствует соединение с сервером',
            });
          } else {
          this.message = 'Ошибка: Проверьте введенные данные';
          subscription.unsubscribe();
          this.openDialog({message: this.message});
        }});
    }
  }
  //TODO:  в отдельный файл
  public openDialog(data: DialogData): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      data,
    });
  }
}
