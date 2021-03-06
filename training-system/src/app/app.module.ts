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
import {TasksModule} from "./components/tasks/tasks.module";
import { StatsDialogComponent } from './components/dialog/stats-dialog/stats.dialog.component';
import { FieldSettingsDialogComponent } from './components/dialog/field-settings-dialog/field-settings-dialog.component';
import {MatSliderModule} from "@angular/material/slider";
import {NgApexchartsModule} from "ng-apexcharts";
import {AllStatsDialogComponent} from "./components/dialog/all-stats-dialog/all-stats.dialog.component";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {StudentSnackBarComponent} from "./components/snack-bar/student-snack-bar/student-snack-bar.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {DragulaModule} from "ng2-dragula";
import {MatSelectModule} from "@angular/material/select";
import {DialogValidateComponent} from "./components/dialog/validate-dialog/dialog.validate.component";
import {FieldGenerateDialogComponent} from "./components/dialog/generate-field-dialog/field-generate-dialog.component";
import { InfoDialogComponent } from './components/dialog/info-dialog/info-dialog.component';


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
    FieldSettingsDialogComponent,
    AllStatsDialogComponent,
    StudentSnackBarComponent,
    DialogValidateComponent,
    FieldGenerateDialogComponent,
    InfoDialogComponent
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
        MatSelectModule,
        HttpClientModule,
        NgbModule,
        MatDialogModule,
        MatSliderModule,
        NgApexchartsModule,
        MatSnackBarModule,
        MatTooltipModule,
        DragulaModule.forRoot(),
    ],
  providers: [HttpClient, HttpInterceptorProvider],
  exports: [
    HeaderComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
