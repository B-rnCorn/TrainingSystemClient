import { Component, Inject, ViewChild } from "@angular/core";
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid
} from "ng-apexcharts";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};
export interface DialogAllStatsData {
  fi: string[][];
  marks: number[][];
}
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};
@Component({
  selector: 'app-all-stats-dialog',
  templateUrl: 'all-stats.dialog.component.html',
  styleUrls: ['all-stats.dialog.component.less']
})
export class AllStatsDialogComponent {

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(
    public dialogRef: MatDialogRef<AllStatsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAllStatsData,
  ) {
    this.chartOptions = {
      series: [
        {
          name: 'Средний балл',
          data: this.getAverageScore(),
        }
      ],
      chart: {
        height: 450,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      colors: [
        '#775DD0',
      ],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true
        }
      },
      dataLabels: {
        enabled: true,
          style: {
            fontSize: '12px',
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontWeight: 'bolder',
        }
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '13px',
            fontFamily: 'Montserrat Alternates, sans-serif',
            }
          }
      },
      xaxis: {
        categories: this.data.fi,
        labels: {
          style: {
            fontSize: '13px',
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontWeight: 'bolder'
          }
        }
      }
    };
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public getAverageScore(): any {
    let scores = [];
    for (let i = 0; i < this.data.marks.length; i++) {
        let mas = this.data.marks[i];
        let score = mas.reduce((a, b) => a + b, 0)/mas.length;
        console.log(score);
        scores.push(score);
      }
    return scores;
    }

}
