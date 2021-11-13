import { Component, OnInit } from '@angular/core';
import {UserDto} from "../../models/userDto";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

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

  constructor(private userService: UserService,
              private router: Router) {}

  ngOnInit(): void {
    this.getUserInGroup();
    this.getAllStudents();
  }

  public deleteUser(username: string): any{
    this.userService.deleteStudentWithoutGroup(username)
      .subscribe(() => {
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
      .subscribe(() => {
        this.getUserInGroup();
        this.getAllStudents();
      });
  }

}
