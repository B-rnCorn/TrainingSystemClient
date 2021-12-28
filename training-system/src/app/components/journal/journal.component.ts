import { Component, OnInit } from '@angular/core';
import {UserDto} from "../../models/userDto";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent, DialogData} from "../dialog/add-delete-students-dialog/dialog.component";
import {SolutionDto} from "../../models/solutionDto";
import {SolutionService} from "../../services/solution.service";
import {DialogStatsData, StatsDialogComponent} from "../dialog/stats-dialog/stats.dialog.component";
import {StudentMarks} from "../../models/studentMarks";
import {AllStatsDialogComponent, DialogAllStatsData} from "../dialog/all-stats-dialog/all-stats.dialog.component";
import {MatSnackBar} from '@angular/material/snack-bar';
import {StudentSnackBarComponent} from "../snack-bar/student-snack-bar/student-snack-bar.component";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.less']
})
export class JournalComponent implements OnInit {
  public show = true;
  active = 1;
  studentsInGroup: UserDto[] = [];
  allStudents: UserDto[] = [];
  studentSolutions: SolutionDto[] = [];
  fi: string[][] = [[]];
  marks: number[][] = [[]];
  message: string;

  constructor(private snackBar: MatSnackBar,
              private userService: UserService,
              private router: Router, public dialog: MatDialog,
              private solutionService: SolutionService) {}

  ngOnInit(): void {
    this.getUserInGroup();
    this.getAllStudents();
  }

  public getStudentSolution(username: string, fio: string): any {
    this.solutionService.getStudentSolutions(username)
      .subscribe((data) => {
        this.studentSolutions = data;
        console.log(data);
        this.openStatsDialog({
          studentsSolutions: this.studentSolutions,
          fio,
        });
      },
        error => {
          if (error.status === 'ERR_CONNECTION_REFUSED') {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: 'Отсутствует соединение с сервером',
            });
          } else {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: error.error.message,
            });
          }
        });

  }

  public deleteUser(username: string): any{
    this.userService.deleteStudentWithoutGroup(username)
      .subscribe(
        (data) => {
        this.message = data.message;
        this.snackBar.openFromComponent(StudentSnackBarComponent, {
          duration: 1500,
          data: this.message,
        });
        // this.openAddOrDeleteDialog({message: this.message});
        this.getUserInGroup();
        this.getAllStudents();
      },
        error => {
          if (error.status === 'ERR_CONNECTION_REFUSED') {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: 'Отсутствует соединение с сервером',
            });
          } else {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: error.error.message,
            });
          }
        });
  }

  public getUserInGroup(): any{
    this.userService.getStudentsInGroup()
      .subscribe((data) => this.studentsInGroup = data,
        error => {
          if (error.status === 'ERR_CONNECTION_REFUSED') {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: 'Отсутствует соединение с сервером',
            });
          } else {
              this.snackBar.openFromComponent(StudentSnackBarComponent, {
                duration: 2000,
                data: error.error.message,
              });
          }
        });
  }
  public getAllStudents(): any{
    this.userService.getAllStudents()
      .subscribe((data) => this.allStudents = data,
        error => {
          if (error.status === 'ERR_CONNECTION_REFUSED') {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: 'Отсутствует соединение с сервером',
            });
          } else {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: error.error.message,
            });
          }
        });
  }
  public addStudentToGroup(username: string): any {
    this.userService.addUserToGroup(username)
      .subscribe((data) => {
        this.message = data.message;
        this.snackBar.openFromComponent(StudentSnackBarComponent, {
          duration: 1500,
          data: this.message,
        });
        this.getUserInGroup();
        this.getAllStudents();
      },
        error => {
          if (error.status === 'ERR_CONNECTION_REFUSED') {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: 'Отсутствует соединение с сервером',
            });
          } else {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: error.error.message,
            });
          }
        });
  }
  public getStudentMarks(): any{
    this.userService.getStudentMarks()
      .subscribe((data) => {
        console.log(data);
        this.fi = (data.map(function(info: StudentMarks): any {return info.fio.split(' ', 2); }));
        this.marks = data.map(function (info: StudentMarks): any {return info.marks; });
        console.log(this.fi);
        console.log(this.marks);
        this.openAllStatsDialog({fi: this.fi, marks: this.marks});
      },
        error => {
          if (error.status === 'ERR_CONNECTION_REFUSED') {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: 'Отсутствует соединение с сервером',
            });
          } else {
            this.snackBar.openFromComponent(StudentSnackBarComponent, {
              duration: 2000,
              data: error.error.message,
            });
          }
        });
  }

  //TODO:  в отдельный файл
  public openAddOrDeleteDialog(data: DialogData): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      data,
    });
  }

  public openStatsDialog(data: DialogStatsData): MatDialogRef<StatsDialogComponent> {
    return this.dialog.open(StatsDialogComponent, {
      height: '500px',
      width: '500px',
      data,
    });
  }
  public openAllStatsDialog(data: DialogAllStatsData): MatDialogRef<AllStatsDialogComponent> {
    return this.dialog.open(AllStatsDialogComponent, {
      height: '630px',
      width: '1900px',
      data,
    });
  }
}
