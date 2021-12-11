import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {MessageResponse} from "../models/messageResponse";
import * as http from "http";
import {TaskStudentDto} from "../models/taskStudentdto";
import {Task} from "protractor/built/taskScheduler";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/task';
  private getTaskByTeacherUrl = this.baseUrl + '/teacher';
  private getTaskForStudentUrl = this.baseUrl + '/student';

  constructor(private http: HttpClient) { }

  public getTaskByTeacher(): Observable<any> {
    return this.
    http.get(this.getTaskByTeacherUrl);
  }
  public deleteTask(id: number): Observable<any> {
    return this.http.delete<MessageResponse>(`${this.baseUrl}/${id}`);
  }
  public getTaskForStudent(): Observable<any> {
    return this.http.get<TaskStudentDto>(this.getTaskForStudentUrl);
  }
}
