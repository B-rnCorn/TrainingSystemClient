import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {MessageResponse} from "../models/messageResponse";

@Injectable({
  providedIn: 'root'
})
export class SolutionService {
  private baseUrl = 'http://localhost:8080/api/solution';
  private studentSolutionsUrl = this.baseUrl + '/student';
  private studentSolutionsUrlForStudent = this.baseUrl + '/all';

  constructor(private http: HttpClient) { }

  public getStudentSolutions(username: string): Observable<any> {
    return this.
    http.get<MessageResponse>(this.studentSolutionsUrl, { params: new HttpParams().append('username', username)});
  }

  public getAllStudentSolutions(): Observable<any> {
    return this.http.get(this.studentSolutionsUrlForStudent);
  }
}
