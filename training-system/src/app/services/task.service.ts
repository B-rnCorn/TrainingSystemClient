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
    return this.http.post(API.SAVE_TASK,TaskService.convertTaskForSave(task, false));
  }

  public updateTask(id: number,task: Task, isPublished: boolean): Observable<any>{
    console.log("Debug: " + isPublished);
    return this.http.post(API.UPDATE_TASK, TaskService.convertTaskForUpdate(id, task, isPublished));
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

  private static convertTaskForUpdate (id: number, task: Task, isPublished: boolean): object{
    return {id: id, title: task.title, description: task.description, map: task.map, isPublished: isPublished}
  }

  private static convertTaskForSave ( task: Task, isPublished: boolean): object{
    return {title: task.title, description: task.description, map: task.map, isPublished: isPublished}
  }
}
