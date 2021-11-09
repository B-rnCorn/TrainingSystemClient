import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TasksComponent} from './tasks.component';
import {TaskCreationComponent} from './task-creation/task-creation.component';
import {TaskSolutionComponent} from './task-solution/task-solution.component';
import {TaskCheckComponent} from './task-check/task-check.component';
import {AppModule} from "../../app.module";
import {HeaderComponent} from "../shared/header/header.component";
import {AppComponent} from "../../app.component";


@NgModule({
  declarations: [
    TasksComponent,
    TaskCreationComponent,
    TaskSolutionComponent,
    TaskCheckComponent,
  ],
  imports: [
    CommonModule,
    AppModule,
  ],
})
export class TasksModule {
}
