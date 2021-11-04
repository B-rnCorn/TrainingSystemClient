import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { TaskCreationComponent } from './task-creation/task-creation.component';
import { TaskSolutionComponent } from './task-solution/task-solution.component';
import { TaskCheckComponent } from './task-check/task-check.component';



@NgModule({
  declarations: [
    TasksComponent,
    TaskCreationComponent,
    TaskSolutionComponent,
    TaskCheckComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TasksModule { }
