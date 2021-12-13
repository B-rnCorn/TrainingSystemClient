const DEFAULT_URL = 'http://localhost:8080/';

export const API = {
  /*Auth API*/
  LOGIN: DEFAULT_URL + 'api/auth/login',
  REGISTER: DEFAULT_URL + 'api/auth/signup',

  /*Tasks API*/
  SAVE_TASK: DEFAULT_URL + 'api/task/save',
  GET_TASK_TEACHER: DEFAULT_URL + 'api/task/teacher',
  GET_TASK_STUDENT: DEFAULT_URL + 'api/task/student',
  DELETE_TASK: DEFAULT_URL + 'api/task',
}
