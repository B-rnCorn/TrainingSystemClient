import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RegisterComponent} from './components/auth/register/register.component';
import {LoginComponent} from './components/auth/login/login.component';
import {InfoComponent} from './components/info/info.component';
import {JournalComponent} from './components/journal/journal.component';
import {MarksComponent} from './components/marks/marks.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {HeaderComponent} from './components/shared/header/header.component';
import {MatInputModule} from '@angular/material/input';
import {LayoutModule} from '@angular/cdk/layout';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {HttpInterceptorProvider} from "./interceptor/auth-interceptor";
import { NotificationComponent } from './components/shared/notification/notification.component';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {DialogComponent} from "./components/dialog/add-delete-students-dialog/dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
//import {TasksModule} from './components/tasks/tasks.module';
import { StatsDialogComponent } from './components/dialog/stats-dialog/stats.dialog.component';
import {TasksComponent} from "./components/tasks/tasks.component";
import {TaskCreationComponent} from "./components/tasks/task-creation/task-creation.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {FieldCellComponent} from "./components/tasks/field/field-cell/field-cell.component";
import {AllStatsDialogComponent} from "./components/dialog/all-stats-dialog/all-stats.dialog.component";
import {NgApexchartsModule} from "ng-apexcharts";


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    InfoComponent,
    JournalComponent,
    MarksComponent,
    HeaderComponent,
    NotificationComponent,
    DialogComponent,
    StatsDialogComponent,
    TasksComponent,
    TaskCreationComponent,
    FieldCellComponent,
    AllStatsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    LayoutModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatDialogModule,
    DragDropModule,
    NgApexchartsModule
  ],
  providers: [HttpClient, HttpInterceptorProvider],
  exports: [
    HeaderComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
