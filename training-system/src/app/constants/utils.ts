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
    taskCreation: 'task-creation',
    taskView: 'task-view',
    info: 'info',
    marks: 'marks',
    journal: 'journal',
    tasks: 'tasks',
  };

  static FIELD_TYPES = {
    monkey: 'm',
    basket: 'u',
    liana: 'l',
    banana: 'b',
    empty: 'e',
  }

  static COMMAND_TYPES = {
    forward:'f',
    backward: 'b',
    turn_right: 'r',
    turn_left: 'l',
    jump: 'j',
    cycle_start: 's',
    cycle_end: 'e',
  }
}
