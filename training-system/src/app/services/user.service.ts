import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDto} from "../models/userDto";
import {MessageResponse} from "../models/messageResponse";
import {StudentMarks} from "../models/studentMarks";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/user';
  private studentsInGroupUrl = this.baseUrl + '/get_students';
  private studentsAllUrl = this.baseUrl;
  private deleteStudentWithoutGroupUrl = this.baseUrl + '/delete_student';
  private addUserToGroupUrl = this.baseUrl + '/add_student';
  private getStudentMarksUrl = this.baseUrl + '/marks';

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
    http.get<MessageResponse>(this.addUserToGroupUrl,
      { params: new HttpParams().append('username', username)});
  }
  public getStudentMarks(): Observable<any> {
    return this.http.get<StudentMarks>(this.getStudentMarksUrl);
  }
}
