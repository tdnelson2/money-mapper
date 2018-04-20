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
    }
  };
  public barChartType: string = 'bar';
  // public barChartType: string = 'horizontalBar';
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

  isare(item: any): string {
    return this._count(item) === 1 ? 'is' : 'are';
  }

  s(item: any): string {
    return this._count(item) === 1 ? '' : 's';
  }

  _count(item: any): number {

    switch (String(typeof(item))) {

      case 'array':
        return item.length;

      case 'object':
        return item.length;

      case 'number':
        return item;

      default:
        return 0;
    }
  }


  public next6Months(): void {
    console.log('next6months clicked')

    const nextDate = this.pd.mappedMonths.slice(-1)[0]
                         .recurrenceDates.slice(-1)[0]
                         .add(this.pd.frequencyInDays, 'days')
                         .format('YYYY-MM-DD');

      const url = "/results?pay="+this.pd.paycheckAmount+
                         "&date="+nextDate+
                    "&frequency="+this.pd.frequencyInDays;

      this.router.navigateByUrl(url);
  }

  prev6Months() {
    // Get the number of days until the beginning
    // of the 6th month in the past
    const start = this.pd.mappedMonths.slice(0)[0]
                      .recurrenceDates.slice(0)[0]
                      .subtract(this.pd.frequencyInDays, 'days');
    const end =  start.clone().subtract(5, 'months');
          end.subtract(end.date()-1, 'days');
    let recurrences = mapMonthlyRecurrences(start, end, this.pd.frequencyInDays);
    const firstDate = recurrences.slice(-1)[0]
                     .recurrenceDates.slice(-1)[0]
                     .format('YYYY-MM-DD');

    const url = "/results?pay="+this.pd.paycheckAmount+
                       "&date="+firstDate+
                  "&frequency="+this.pd.frequencyInDays;

    this.router.navigateByUrl(url);
  }

  private updateChartData(): void {
    console.log('update being called');
    // Get number of days to the end of the 6th month
    const start = moment(this.pd.nextPayday);
    const days = start.clone().add(6, 'months').endOf('month').diff(start, 'days');

    console.log('start: ',start.toDate());
    console.log('days: ',days);

    // Add recurrence data to `this.pd`
    mapPayRecurrence(this.pd, days);
    console.log('mapped months: ',this.pd.mappedMonths);

    this.clearChart();

    let currentYear;
    for (var i = 0; i < this.pd.mappedMonths.length; ++i) {
      const month = this.pd.mappedMonths[i];

      const income = month.recurrenceCount*this.pd.paycheckAmount;

      // Add total income for each month to chart
      this.barChartData[0].data.push(Math.round(income));

      // Build the label for each month
      const monthName = month.year === currentYear ? month.name : `${month.name} ${month.year}`
      currentYear = month.year;
      this.barChartLabels.push(monthName);

      // Use colors to highlight outlier months
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

          if ( params.frequency === '-1' ) {
            this.pd.frequency = 'Every month';

            // Since this app isn't designed for people who
            // are paid monthly, we'll just generate a hypothetical
            // "if you were paid every two weeks" example
            this.pd.frequencyInDays = 14;
          } else {
            if ( params.frequency === '7' ) {
              this.pd.frequency = 'Every week';
            } else if ( params.frequency === '14' ) {
              this.pd.frequency = 'Every 2 weeks';
            }
          }
          this.updateChartData();
		  	} else {
          this.router.navigateByUrl('main');
		  	}
      });
  }

}
