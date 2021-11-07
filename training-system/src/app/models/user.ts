import {CONSTANTS} from "../constants/utils";

export class User {
  id: string = CONSTANTS.EMPTY;
  name: string = '';
  login: string = '';
  password: string = '';
  role: string = CONSTANTS.ROLES.anonymous;

  constructor( name: string = '',
               login: string = '',
               password: string = '',
               role: string = CONSTANTS.ROLES.student,
               id: string = CONSTANTS.EMPTY) {
    this.name = name;
    this.login = login;
    this.password = password;
    this.role = role;
    this.id = id;
  }
}
