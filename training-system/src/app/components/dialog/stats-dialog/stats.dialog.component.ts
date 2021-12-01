import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SolutionDto} from "../../../models/solutionDto";

export interface DialogStatsData {
  studentsSolutions: SolutionDto[];
  fio: string;
}
@Component({
  selector: 'app-stats-dialog',
  templateUrl: 'stats.dialog.component.html',
  styleUrls: ['stats.dialog.component.less']
})
export class StatsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StatsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogStatsData,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
