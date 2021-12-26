import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../add-delete-students-dialog/dialog.component";

export interface GenerateData {
  maxCountBananas: number;
  maxCountLianas: number;
  maxCountBaskets: number;
}
@Component({
  selector: 'app-field-settings-dialog',
  templateUrl: './field-generate-dialog.component.html',
  styleUrls: ['./field-generate-dialog.component.less']
})
export class FieldGenerateDialogComponent implements OnInit {
  public countBananas: number = 1;
  public countLianas: number = 0;
  public countBaskets: number = 1;

  _generateForm: FormGroup = new FormGroup({
    "countBananas": new FormControl("1",
      [Validators.required]),
    "countBaskets": new FormControl("1",
      [Validators.required]),
    "countLianas": new FormControl("0",
      [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<FieldGenerateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GenerateData) {
  }

  ngOnInit(): void {
  }

  public countBananasChange(event: any, isInput: boolean = false) {
    console.log(event);
    if (!isInput) {
      this._generateForm.patchValue({countBananas: event});
      this.countBananas = event;
    } else {
      this.countBananas = Number.parseInt(event.data);
    }
  }
  public countLianasChange(event: any, isInput: boolean = false) {
    console.log(event);
    if (!isInput) {
      this._generateForm.patchValue({countLianas: event});
      this.countLianas = event;
    } else {
      this.countLianas = Number.parseInt(event.data);
    }
  }
  public countBasketsChange(event: any, isInput: boolean = false) {
    console.log(event);
    if (!isInput) {
      this._generateForm.patchValue({countBaskets: event});
      this.countBaskets = event;
    } else {
      this.countBaskets = Number.parseInt(event.data);
    }
  }

  public submit() {
    this.dialogRef.close({
      countBananas: this.countBananas,
      countLianas: this.countLianas,
      countBaskets: this.countBaskets
    });
  }
  public cancel() {
    this.dialogRef.close();
  }
}
