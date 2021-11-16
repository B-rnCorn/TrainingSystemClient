import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDto} from "../models/userDto";
import {MessageResponse} from "../models/messageResponse";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private studentsInGroupUrl = 'http://localhost:8080/api/user/get_students';
  private studentsAllUrl = 'http://localhost:8080/api/user';
  private deleteStudentWithoutGroupUrl = 'http://localhost:8080/api/user/delete_student';
  private addUserToGroupUrl = 'http://localhost:8080/api/user/add_student';

  constructor(private http: HttpClient) { }

  public getStudentsInGroup(): Observable<any> {
    return this.http.get<UserDto>(this.studentsInGroupUrl);
  }

  public getAllStudents(): Observable<any> {
    return this.http.get<UserDto>(this.studentsAllUrl);
  }

  public deleteStudentWithoutGroup(username: string): Observable<MessageResponse> {
    return this.http
      .delete<MessageResponse>(this.deleteStudentWithoutGroupUrl, {params: new HttpParams().append('username', username)});
  }
  public addUserToGroup(username: string): Observable<MessageResponse> {
    return this.
    http.get<MessageResponse>(this.addUserToGroupUrl, { params: new HttpParams().append('username', username)});
  }
}
