import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../add-delete-students-dialog/dialog.component";

@Component({
  selector: 'app-field-settings-dialog',
  templateUrl: './field-settings-dialog.component.html',
  styleUrls: ['./field-settings-dialog.component.less']
})
export class FieldSettingsDialogComponent implements OnInit {
  public dimension: number = 4;

  _settingsForm: FormGroup = new FormGroup({
    "filedSideLength": new FormControl("4",
      [Validators.required]),
  });

  constructor(public dialogRef: MatDialogRef<FieldSettingsDialogComponent>, @Inject(MAT_DIALOG_DATA) data: DialogData) {
  }

  ngOnInit(): void {
  }

  public onSideLengthChange(event: any, isInput: boolean = false) {
    console.log(event);
    if (!isInput) {
      this._settingsForm.patchValue({filedSideLength: event});
      this.dimension = event;
    } else {
      this.dimension = Number.parseInt(event.data);
    }
  }

  public submit() {
    this.dialogRef.close({dimension:this.dimension});
  }
  public cancel() {
    this.dialogRef.close();
  }
}
