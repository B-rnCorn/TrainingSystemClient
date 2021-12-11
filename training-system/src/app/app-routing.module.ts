import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from "./components/auth/register/register.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {CONSTANTS} from "./constants/utils";
import {TasksComponent} from "./components/tasks/tasks.component";
import {InfoComponent} from "./components/info/info.component";
import {MarksComponent} from "./components/marks/marks.component";
import {JournalComponent} from "./components/journal/journal.component";
import {TaskCreationComponent} from "./components/tasks/task-creation/task-creation.component";
import {TaskViewComponent} from "./components/tasks/task-view/task-view.component";

const routes: Routes = [
  { path: CONSTANTS.TABS.register, component: RegisterComponent },
  { path: CONSTANTS.TABS.login, component: LoginComponent },
  { path: CONSTANTS.TABS.taskCreation, component: TaskCreationComponent },
  { path: CONSTANTS.TABS.taskView, component: TaskViewComponent },
  { path: CONSTANTS.TABS.info, component: InfoComponent },
  { path: CONSTANTS.TABS.marks, component: MarksComponent },
  { path: CONSTANTS.TABS.journal, component: JournalComponent },
  { path: '', component: RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
