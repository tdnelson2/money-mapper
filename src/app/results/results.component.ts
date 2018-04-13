import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe }           from '@angular/common';
import * as moment                from 'moment/moment';

import 'rxjs/add/operator/filter';

import { ParamValidatorService } from '../param-validator.service';
import { mapPayRecurrence }         from '../map-pay-recurrence';
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
    maintainAspectRatio: true,
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
  public barChartType: string = 'horizontalBar';
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
          mapPayRecurrence(this.pd);
          let currentYear;
          let index = 0;
          for (let month of this.pd.mappedMonths) {
            this.barChartData[0].data.push(Math.round(month.recurrenceCount*this.pd.paycheckAmount));
            const monthName = month.year === currentYear ? month.name : `${month.name} ${month.year}`
            currentYear = month.year;
            this.barChartLabels.push(monthName);
            this.barChartColors[0].backgroundColor.push('rgba(255,255,255, 0)');
            this.barChartColors[0].borderColor.push('rgba(255,255,255, 1)');
            if (index === 6) { return; } else { index++ };
          }
          // this.pd.mappedMonths.forEach(month => {
          //   this.barChartData[0].data.push(Math.round(month.recurrenceCount*this.pd.paycheckAmount));
          //   const monthName = month.year === currentYear ? month.name : `${month.name} ${month.year}`
          //   currentYear = month.year;
          //   this.barChartLabels.push(monthName);
          // });
		  	} else {
          this.router.navigateByUrl('main');
		  	}
      });
  }

}
