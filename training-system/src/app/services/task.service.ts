import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {MessageResponse} from "../models/messageResponse";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/task';
  private getTaskByTeacherUrl = this.baseUrl + '/teacher';

  constructor(private http: HttpClient) { }

  public getTaskByTeacher(): Observable<any> {
    return this.
    http.get<MessageResponse>(this.getTaskByTeacherUrl);
  }
  public deleteTask(id: number): Observable<any> {
    return this.http.delete<MessageResponse>(`${this.baseUrl}/${id}`);
  }
}
