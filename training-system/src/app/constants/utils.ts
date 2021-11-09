export class CONSTANTS{
  static ROLES = {
    anonymous: 'ROLE_ANON',
    student: 'ROLE_STUDENT',
    teacher: 'ROLE_TEACHER',
  }
  static EMPTY = 'EMPTY ID'
  static TOKEN_KEY = 'AuthToken';
  static USERNAME_KEY = 'AuthUsername';
  static AUTHORITIES_KEY = 'AuthAuthorities';
  static TOKEN_HEADER_KEY = 'Authorization';
  static TOKEN_TYPE_KEY = 'AuthTokenType';

  static TABS = {
    login: 'login',
    register: 'register',
    tasks: 'tasks',
    info: 'info',
    marks: 'marks',
  }
}
