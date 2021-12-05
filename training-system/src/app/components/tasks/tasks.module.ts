import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TasksComponent} from './tasks.component';
import {TaskCreationComponent} from './task-creation/task-creation.component';
import {TaskSolutionComponent} from './task-solution/task-solution.component';
import {TaskCheckComponent} from './task-check/task-check.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {AppModule} from "../../app.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import { FieldCellComponent } from './field/field-cell/field-cell.component';
import { FieldItemsListComponent } from './field/field-items-list/field-items-list.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSliderModule} from "@angular/material/slider";


@NgModule({
  declarations: [
    TasksComponent,
    TaskCreationComponent,
    TaskSolutionComponent,
    TaskCheckComponent,
    FieldCellComponent,
    FieldItemsListComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    AppModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule
  ],
  exports: [
    TasksComponent,
    TaskCreationComponent,
    TaskSolutionComponent,
    TaskCheckComponent,
  ]
})
export class TasksModule {
}
