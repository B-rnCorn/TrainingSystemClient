import { Component, OnInit } from '@angular/core';
import {UserDto} from "../../models/userDto";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent, DialogData} from "../dialog/dialog.component";

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
  message: string;

  constructor(private userService: UserService,
              private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUserInGroup();
    this.getAllStudents();
  }

  public deleteUser(username: string): any{
    this.userService.deleteStudentWithoutGroup(username)
      .subscribe((data) => {
        this.message = data.message;
        this.openDialog({message: this.message});
        this.getUserInGroup();
        this.getAllStudents();
      });
  }

  public getUserInGroup(): any{
    this.userService.getStudentsInGroup()
      .subscribe((data) => this.studentsInGroup = data);
  }
  public getAllStudents(): any{
    this.userService.getAllStudents()
      .subscribe((data) => this.allStudents = data);
  }
  public addStudentToGroup(username: string): any {
    this.userService.addUserToGroup(username)
      .subscribe((data) => {
        this.message = data.message;
        this.openDialog({message: this.message});
        this.getUserInGroup();
        this.getAllStudents();
      });
  }

  //TODO:  в отдельный файл
  public openDialog(data: DialogData): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      data,
    });
  }
}
