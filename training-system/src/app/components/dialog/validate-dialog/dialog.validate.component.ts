import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface DialogValidateData {
  errors: string[];
}
@Component({
  selector: 'app-validate-dialog',
  templateUrl: 'dialog.validate.component.html',
  styleUrls: ['dialog.validate.component.less']
})
export class DialogValidateComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogValidateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogValidateData,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
