import { Component, OnInit } from '@angular/core';
import {TaskService} from "../../../services/task.service";
import {TaskDto} from "../../../models/taskDto";
import {Router} from "@angular/router";
import {StudentSnackBarComponent} from "../../snack-bar/student-snack-bar/student-snack-bar.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {log} from "util";
import {TokenService} from "../../../services/token.service";
import {SolutionService} from "../../../services/solution.service";
import {SolutionDto} from "../../../models/solutionDto";
import {TaskStudentDto} from "../../../models/taskStudentdto";

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.less']
})
export class TaskViewComponent implements OnInit {

  public roles: string[] = this.tokenService.getAuthorities();
  public username: any = this.tokenService.getUsername();
  teacherTasks: TaskDto[] = [];
  studentTasks: TaskStudentDto[] = [];
  message: string;
  constructor(private taskService: TaskService, private router: Router, private snackBar: MatSnackBar,
              private tokenService: TokenService, private solutionService: SolutionService) { }

  ngOnInit(): void {
    if (this.roles.includes('ROLE_TEACHER')) {
      this.getTaskByTeacher();
    }
    else if (this.roles.includes('ROLE_STUDENT') && this.username){
      this.getTaskForStudent();
    }
  }
  public deleteTask(id: number): any{
    this.taskService.deleteTask(id)
      .subscribe((data) => {
        this.message = data.message;
        this.snackBar.openFromComponent(StudentSnackBarComponent, {
          duration: 1500,
          data: this.message,
        });
        this.getTaskByTeacher();
      });
  }
  public getTaskByTeacher(): any {
    this.taskService.getTaskByTeacher()
      .subscribe((data) => {
        this.teacherTasks = data;
        console.log(this.teacherTasks);
      });
  }

  public getTaskForStudent(): any {
    this.taskService.getTaskForStudent()
      .subscribe((data) => {
        console.log(data);
        this.studentTasks = data;
      });
  }

  public navigate(path: string){
    console.log(path);
    this.router.navigate([path]);
  }

}
