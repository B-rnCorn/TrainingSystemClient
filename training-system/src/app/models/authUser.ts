import {CONSTANTS} from "../constants/utils";
import {User} from "./user";

export class AuthUser {
  user: User = new User();
  roles: string[] = [CONSTANTS.ROLES.anonymous];
  accessToken: string = '';
  refreshToken: string = '';


  constructor( user: User = new User(),
               roles: string[] = [CONSTANTS.ROLES.anonymous],
               accessToken: string = '',
               refreshToken: string = '') {
  }
}
