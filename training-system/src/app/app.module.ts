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
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {HeaderComponent} from './components/shared/header/header.component';
import {MatInputModule} from "@angular/material/input";
import {LayoutModule} from '@angular/cdk/layout';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {HttpInterceptorProvider} from "./interceptor/auth-interceptor";
import { NotificationComponent } from './components/shared/notification/notification.component';
import {TasksModule} from "./components/tasks/tasks.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    InfoComponent,
    JournalComponent,
    MarksComponent,
    HeaderComponent,
    NotificationComponent
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
    NgbModule
  ],
  providers: [HttpClient, HttpInterceptorProvider],
  exports: [
    HeaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
