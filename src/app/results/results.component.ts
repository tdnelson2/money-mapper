import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { CurrencyPipe } from '@angular/common';

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
          this.pd.data.nextPayday = new Date(params.date);
          this.pd.data.paycheckAmount = +params.pay;
          this.pd.data.frequency = params.frequency;
          this.payRecurrenceService.buildResults(this.pd.data);
		  	} else {
          this.router.navigateByUrl('/');
		  	}
      });
  }

}
