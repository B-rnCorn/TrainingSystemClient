import {CONSTANTS} from "../constants/utils";
import {User} from "./user";

export class AuthUser {
  user: User = new User();
  roles: string[] = [CONSTANTS.ROLES.anonymous];
  token: string = '';
  type: string = '';


  constructor(user: User = new User(),
              roles: string[] = [CONSTANTS.ROLES.anonymous],
              token: string = '',
              type: string = '') {
  }
}
