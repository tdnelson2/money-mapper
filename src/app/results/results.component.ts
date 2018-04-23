import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe }           from '@angular/common';
import * as moment                from 'moment/moment';
import { Moment }                 from 'moment/moment';

import 'rxjs/add/operator/filter';

import { ParamValidatorService } from '../param-validator.service';
import { mapPayRecurrence }      from '../map-pay-recurrence';
import { mapMonthlyRecurrences } from '../map-monthly-recurrences';
import { PaydayService }         from '../payday.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  public barChartOptions:any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Cash Flows',
      fontColor: '#ffffff'
    },
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#ffffff',
          beginAtZero: true
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: '#ffffff',
          beginAtZero: true
        }
      }]
    },
    tooltips: {
      callbacks: {
        title: (item, data) => {
          const r = this.pd.mappedMonths[item[0].index];
          return `${r.name} ${r.year}`;
        },
        label: (item, data) => {
          let pay = String(item.yLabel);
          if (item.yLabel >= 1000) {
            // Add commas for numbers greater than 1000
            let [res, len] = ['', pay.length];
            for (let i = len-1; i > -1; --i) {
              if (i+1 !== len && (len - (i+1)) % 3 === 0) res = `,${res}`;
              res = pay[i]+res;
            }
            pay = res;
          }
          return '$'+pay;
        },
        afterLabel: (item, data) => {
          const dates = this.pd.mappedMonths[item.index]
                         .recurrenceDates.map(d => d.format('Do'));
          return `Payday${dates.length > 1 ? 's' : ''}: ${dates.join(', ')}`;
        },
        labelColor: (item, data) => {
          return {
              borderColor: this.barChartColors[0].borderColor[item.index],
              backgroundColor: this.barChartColors[0].backgroundColor[item.index]
          }
        }
      }
    }
  };

  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartLabels: string[] = [];
  public barChartData: any[] =
          [{
            data:[],
            borderWidth: 1
          }];
  public barChartColors: any =
         [{
           backgroundColor: [],
           borderColor: []
         }];

  constructor(
  	private paramValidator: ParamValidatorService,
    private route: ActivatedRoute,
    private router: Router,
    public  pd: PaydayService
	) { }

  public next6Months(): void {
    this.newChart(
        this.pd.mappedMonths.slice(-1)[0]
            .recurrenceDates.slice(-1)[0]
            .add(this.pd.frequencyInDays, 'days')
            .format('YYYY-MM-DD')
    );
  }

  prev6Months() {
    const start = this.pd.mappedMonths[0]
                      .recurrenceDates[0]
                      .subtract(this.pd.frequencyInDays, 'days');
    const end =  start.clone()
                      .subtract(5, 'months');
                   end.subtract(end.date()-1, 'days');
    this.newChart(
         mapMonthlyRecurrences(start, end, this.pd.frequencyInDays).slice(-1)[0]
        .recurrenceDates.slice(-1)[0]
        .format('YYYY-MM-DD')
    );
  }

  private newChart(date) {
    const url = "/results?pay="+this.pd.paycheckAmount+
                       "&date="+date+
                  "&frequency="+this.pd.frequencyInDays;
    this.router.navigateByUrl(url);
  }

  private updateChartData(): void {

    // Get number of days to the end of the 6th month
    const start = moment(this.pd.nextPayday);
    const days = start.clone().add(5, 'months').endOf('month').diff(start, 'days');

    // Add recurrence data to `this.pd`
    mapPayRecurrence(this.pd, days);

    this.clearChart();

    let currentYear;
    for (let month of this.pd.mappedMonths) {

      const income = month.recurrenceCount*this.pd.paycheckAmount;

      // Add total income for each month to chart
      this.barChartData[0].data.push(Math.round(income));

      // Abreviate long months
      const m = month.name.length > 5 ? month.name.slice(0,3)+'.' : month.name;

      // Build the label for each month
      const monthName = month.year === currentYear ? m : `${m} ${month.year}`
      currentYear = month.year;
      this.barChartLabels.push(monthName);

      // Highlight outlier months
      if (this.pd.lowMonthPayAmount != income) {
        this.barChartColors[0].backgroundColor.push('rgba(255,255,255, 0.3)');
      } else {
        this.barChartColors[0].backgroundColor.push('rgba(255,255,255, 0)');
      }
      this.barChartColors[0].borderColor.push('rgba(255,255,255, 1)');
    }
  }

  private clearChart(): void {
    [this.barChartData[0].data,
     this.barChartLabels,
     this.barChartColors[0].backgroundColor,
     this.barChartColors[0].borderColor] = [[],[],[],[]];
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
		  	if ( this.paramValidator.paramsAreValid(params) ) {

          this.pd.nextPayday = moment(params.date, 'YYYY-MM-DD').toDate();
          this.pd.paycheckAmount = +params.pay;
          this.pd.frequencyInDays = +params.frequency;
          this.updateChartData();
		  	} else {
          this.router.navigateByUrl('main');
		  	}
      });
  }

}
