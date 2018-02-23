import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { CurrencyPipe } from '@angular/common';
import * as moment from 'moment/moment';


import { ParamValidatorService } from '../param-validator.service';
import { PayRecurrenceService } from '../pay-recurrence.service';
import { Payday } from '../payday';
import { PaydaySessionDataService } from '../payday-session-data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(
  	private paramValidator: ParamValidatorService,
    private route: ActivatedRoute,
    private router: Router,
    private payRecurrenceService: PayRecurrenceService,
    private pd: PaydaySessionDataService
	) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
		  	if ( this.paramValidator.paramsAreValid(params) ) {

          this.pd.data.nextPayday = moment(params.date, 'YYYY-MM-DD').toDate();
          this.pd.data.paycheckAmount = +params.pay;
          this.pd.data.frequencyInDays = +params.frequency;

          if ( params.frequency === '-1' ) {
            this.pd.data.frequency = 'Every month';
            console.log('Month results (no "extra months")');

            // Since MoneyFinder isn't designed for people who 
            // are paid monthly, we'll just generate a hypothetical
            // "if you were paid every two weeks" example
            this.pd.data.frequencyInDays = 14;
            this.payRecurrenceService.buildResults(this.pd.data);
          } else {
            if ( params.frequency === '7' ) {
              this.pd.data.frequency = 'Every week';
            } else ( params.frequency === '14' ) {
              this.pd.data.frequency = 'Every 2 weeks';
            }
            this.payRecurrenceService.buildResults(this.pd.data);
            console.log(this.pd.data);
          }
		  	} else {
          this.router.navigateByUrl('/');
		  	}
      });
  }

}
