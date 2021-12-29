import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {MessageResponse} from "../models/messageResponse";
import {SolutionDto} from "../models/solutionDto";

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
    http.get(this.studentSolutionsUrl, { params: new HttpParams().append('username', username)});
  }

  public getAllStudentSolutions(): Observable<any> {
    return this.http.get(this.studentSolutionsUrlForStudent);
  }

  public saveSolution(taskId: number, algorithm: string): Observable<any> {
    return this.http.post(this.baseUrl + '/save', {taskId: taskId, algorithm: algorithm, isSend: false});
  }

  public updateSolution(solutionId: number, algorithm: string): Observable<any>{
    console.log('SOLUTION_ID',solutionId);
    return this.http.post(this.baseUrl + '/update', {id: solutionId, algorithm: algorithm, isSend: false})
  }

  public publishSolution(solutionId: number, algorithm: string): Observable<any>{
    console.log('SOLUTION_ID',solutionId);
    return this.http.post(this.baseUrl + '/update', {id: solutionId, algorithm: algorithm, isSend: true})
  }

  public getSolutionsForTask(taskId: number): Observable<any> {
    return this.http.get(this.studentSolutionsUrl + '/getSolution', { params: new HttpParams().append('taskId', String(taskId))});
  }

  public getStudentsForTask(taskId: number): Observable<any> {
    return this.http.get(this.baseUrl + '/getUsers', { params: new HttpParams().append('taskId', String(taskId))});
  }

  public getStudentSolution(userId: number,taskId: number): Observable<any> {
    return this.http.get(this.baseUrl + '/getStudentSol', { params: new HttpParams().append('userId', String(taskId)).append('taskId', String(taskId))});
  }

  public sendMark(solutionId: number,mark: number): Observable<any> {
    return this.http.get(this.baseUrl + '/setMark', { params: new HttpParams().append('solutionId', String(solutionId)).append('mark', String(mark))});
  }
}
