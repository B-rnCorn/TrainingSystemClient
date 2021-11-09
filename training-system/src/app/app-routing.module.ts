import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from "./components/auth/register/register.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {CONSTANTS} from "./constants/utils";

const routes: Routes = [
  { path: CONSTANTS.TABS.register, component: RegisterComponent },
  { path: CONSTANTS.TABS.login, component: LoginComponent },
  { path: '', component: RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
