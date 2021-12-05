import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-field-settings-dialog',
  templateUrl: './field-settings-dialog.component.html',
  styleUrls: ['./field-settings-dialog.component.less']
})
export class FieldSettingsDialogComponent implements OnInit {

  public squareOfField: number = 0;

  _settingsForm: FormGroup = new FormGroup({
    "filedSideLength": new FormControl("",
      [Validators.required/*,
        Validators.email*/]),
    "password": new FormControl("",
      [Validators.required]),
  });

  constructor() { }

  ngOnInit(): void {
  }

  public onSideLengthChange(event: any) {
    console.log(event);
    this._settingsForm.patchValue({filedSideLength: event});
    this.squareOfField = Math.pow(event,2)
  }
}
