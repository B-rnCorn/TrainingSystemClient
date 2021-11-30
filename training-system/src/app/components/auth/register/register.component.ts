import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user";
import {AuthService} from "../../../services/auth.service";
import {CONSTANTS} from "../../../constants/utils";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogComponent, DialogData} from "../../dialog/dialog.component";
import {min} from "rxjs/operators";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  message: string;
  _formErrorsMessages: any;

  public setMessage(message: any) {
    this.message = message;
  }

  _registrationForm: FormGroup = new FormGroup({
    "name": new FormControl("",
      [Validators.required, Validators.maxLength(21)/*, Validators.pattern(/[a-zA-Z]+/g)*/]),
    "surname": new FormControl("",
      [Validators.required, Validators.maxLength(21)]),
    "patronymic": new FormControl("",
      Validators.maxLength(21)),
    "email": new FormControl("",
      [Validators.required,
        Validators.minLength(4), Validators.maxLength(16)]),
    "password": new FormControl("",
      [Validators.required, Validators.minLength(4), Validators.maxLength(16)]),
    "secondPassword": new FormControl("",
      [Validators.required,]),
  });

  userNameValidator(control: FormControl): {[s:string]:boolean}|null{

    if(control.value==="нет"){
      return {"userName": true};
    }
    return null;
  }

  _choosedRole: string = CONSTANTS.ROLES.student;

  private user: any;

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  onChangeRole(event: any) {
    if (event.checked) {
      this._choosedRole = CONSTANTS.ROLES.teacher;
    } else {
      this._choosedRole = CONSTANTS.ROLES.student;
    }
  }

  //TODO: Доделать валидацию
  onSubmit(event: any) {
    console.log(event);
    if (!this._registrationForm.invalid) {
      /*Object.keys(this.registrationForm.controls).forEach(controlName => {
        this.registrationForm.controls[controlName];
      });
      return*/
      console.log(this._registrationForm.value);
      this.user = new User(
        RegisterComponent.preprocessName(this._registrationForm.value['surname'], this._registrationForm.value['name'], this._registrationForm.value['patronymic']),
        this._registrationForm.value['email'],
        this._registrationForm.value['password'],
        this._choosedRole,
        CONSTANTS.EMPTY
      )
      console.log(this.user);
      let subscription = this.authService.register(this.user).subscribe(
        data => {
          this.message = data.message;
          subscription.unsubscribe();
          this.openDialog({message: this.message});

          this.router.navigate(['login']);
        },
        error => {
          this.message = error.error.message;
          subscription.unsubscribe();
          const dialogRef = this.openDialog({message: this.message});
        });
      console.log(this.message);
    } else {
      //TODO: разбить на методы
      this._formErrorsMessages = {
        'name': '',
        "surname": '',
        "patronymic": '',
        "email": '',
        "password": '',
      };
      if (this._registrationForm.get('name')?.errors && this._registrationForm.get('name')?.hasError('maxlength')) {
        this._formErrorsMessages['name'] += 'Максимальное количество символов для имени:' +
          this._registrationForm.get('name')?.errors?.maxlength?.requiredLength + ', вы ввели:' +
          this._registrationForm.get('name')?.errors?.maxlength?.actualLength;
      }
      if (this._registrationForm.get('surname')?.errors && this._registrationForm.get('surname')?.hasError('maxlength')) {
        this._formErrorsMessages['surname'] += 'Максимальное количество символов для фамилии:' +
          this._registrationForm.get('surname')?.errors?.maxlength?.requiredLength + ', вы ввели:' +
          this._registrationForm.get('surname')?.errors?.maxlength?.actualLength;
      }
      if (this._registrationForm.get('patronymic')?.errors && this._registrationForm.get('patronymic')?.hasError('maxlength')) {
        this._formErrorsMessages['patronymic'] += 'Максимальное количество символов для отчество:' +
          this._registrationForm.get('patronymic')?.errors?.maxlength?.requiredLength + ', вы ввели:' +
          this._registrationForm.get('patronymic')?.errors?.maxlength?.actualLength;
      }
    }
  }

  //TODO: Вынестив отдельный сервис
  private static preprocessName(surname: string, name: string, patronymic: string): string {
    return surname + ' ' + name + ' ' + patronymic;
  }

  //TODO:  в отдельный файл
  public openDialog(data: DialogData): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      data,
    });
  }
}

