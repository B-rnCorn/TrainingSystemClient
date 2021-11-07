import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user";
import {AuthService} from "../../../services/auth.service";
import {CONSTANTS} from "../../../constants/utils";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  _registrationForm: FormGroup = new FormGroup({
    "name": new FormControl(),
    "surname": new FormControl(),
    "patronymic": new FormControl(),
    "email": new FormControl("",
      [Validators.required,
      Validators.email]),
    "password": new FormControl(),
    "secondPassword": new FormControl(),
  });

  _choosedRole: string = CONSTANTS.ROLES.student;

  private user: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onChangeRole(event: any){
    if (event.checked) {
      this._choosedRole = CONSTANTS.ROLES.teacher;
    } else {
      this._choosedRole = CONSTANTS.ROLES.student;
    }
  }
  //TODO: Доделать валидацию
  onSubmit(event: any){
    console.log(event);
    if (!this._registrationForm.invalid) {
      /*Object.keys(this.registrationForm.controls).forEach(controlName => {
        this.registrationForm.controls[controlName];
      });
      return*/
      console.log(this._registrationForm.value);
      this.user = new User(
        RegisterComponent.preprocessName(this._registrationForm.value['name'],this._registrationForm.value['surname'],this._registrationForm.value['patronymic']),
        this._registrationForm.value['email'],
        this._registrationForm.value['password'],
        this._choosedRole,
        CONSTANTS.EMPTY
      )
      console.log(this.user);
      let subscribtion = this.authService.register(this.user).subscribe(res => {
        subscribtion.unsubscribe();
      })
    }
  }

  //TODO: Вынестив отдельный сервис
  private static preprocessName(name: string, surname: string, patronymic: string): string{
    return name + ' ' + surname + ' ' + patronymic
  }


}
