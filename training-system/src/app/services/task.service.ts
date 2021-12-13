import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {MessageResponse} from "../models/messageResponse";
import {TaskStudentDto} from "../models/taskStudentdto";
import {API} from "../constants/API";
import {Task} from "../models/task";
import {TaskDto} from "../models/taskDto";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /*private Tasks:TaskDto[];
  private activeTask: Task;*/

  constructor(private http: HttpClient) { }

  public saveTask(task: Task): Observable<any> {
    return this.http.post(API.SAVE_TASK,task);
  }

  public getTaskByTeacher(): Observable<any[]> {
    // @ts-ignore
    return this.http.get(API.GET_TASK_TEACHER);
  }
  public deleteTask(id: number): Observable<any> {
    return this.http.delete<MessageResponse>(`${API.DELETE_TASK}/${id}`);
  }
  public getTaskForStudent(): Observable<any> {
    return this.http.get<TaskStudentDto>(API.GET_TASK_STUDENT);
  }
}
