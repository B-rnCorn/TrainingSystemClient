import {Component, OnInit, ViewChild} from '@angular/core';

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
import {SolutionService} from "../../services/solution.service";
import {SolutionDto} from "../../models/solutionDto";
import {StudentMarks} from "../../models/studentMarks";

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
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.less']
})
export class MarksComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public solutions: SolutionDto[] = [];

  constructor(solutionService: SolutionService) {
    solutionService.getAllStudentSolutions()
      .subscribe(data => {
        this.solutions = data;
        let marks = data.map(function(info: SolutionDto): any {return info.mark;});
        let count_0 = marks.filter((el: number) => el === 0).length;
        let count_1 = marks.filter((el: number) => el === 1).length;
        let count_2 = marks.filter((el: number) => el === 2).length;
        let count_3 = marks.filter((el: number) => el === 3).length;
        let count_4 = marks.filter((el: number) => el === 4).length;
        let count_5 = marks.filter((el: number) => el === 5).length;
        console.log(marks);
        this.chartOptions = {
          series: [
            {
              name: "distibuted",
              data: [count_5, count_4, count_3, count_2, count_1, count_0]
            }
          ],
          chart: {
            height: 350,
            type: "bar",
            events: {
              // click: function(chart, w, e) {
              //   // console.log(chart, w, e)
              // }
            },
          },
          colors: [
            "#33CC00",
            "#33FF66",
            "#FFFF00",
            "#FF6600",
            "#FF0000",
            "#000000",
          ],

          plotOptions: {
            bar: {
              columnWidth: "80%",
              distributed: true
            }
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false
          },
          grid: {
            show: false
          },
          yaxis:{
            labels: {
              style: {
                fontSize: "16px",
                fontFamily: "Montserrat Alternates, sans-serif",
              },
              formatter: function(val: any) {
                return val.toFixed(0)
              },

            }
          },
          xaxis: {
            categories: [
              ["5"],
              ["4"],
              ["3"],
              ["2"],
              ["1"],
              ["0"]
            ],
            labels: {
              style: {
                colors: [
                  "#0C9300",
                  "#00AD4B",
                  "#FCAC00",
                  "#F95300",
                  "#F70000",
                  "#000000",
                ],
                fontSize: "16px",
                fontFamily: "Montserrat Alternates, sans-serif",
              }
            }
          }
        };
      });
  }

  ngOnInit(): void {
  }

}
