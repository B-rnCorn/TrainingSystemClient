import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from "./components/auth/register/register.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {CONSTANTS} from "./constants/utils";
import {TasksComponent} from "./components/tasks/tasks.component";
import {InfoComponent} from "./components/info/info.component";
import {MarksComponent} from "./components/marks/marks.component";

const routes: Routes = [
  { path: CONSTANTS.TABS.register, component: RegisterComponent },
  { path: CONSTANTS.TABS.login, component: LoginComponent },
  { path: CONSTANTS.TABS.tasks, component: TasksComponent },
  { path: CONSTANTS.TABS.info, component: InfoComponent },
  { path: CONSTANTS.TABS.marks, component: MarksComponent },
  { path: '', component: RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
