import {Component, Inject} from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-snack-bar',
  templateUrl: 'student-snack-bar.component.html',
  styles: [
    `
      .snack-message {
        color: #ffffff;
      }
    `,
  ],
})
export class StudentSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }
}
