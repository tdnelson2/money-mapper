import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { CurrencyPipe } from '@angular/common';

import { ParamValidatorService } from '../param-validator.service';
import { PayRecurrenceService } from '../pay-recurrence.service';
import { Payday } from '../payday';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  payday: Payday;

  constructor(
  	private paramValidator: ParamValidatorService,
    private route: ActivatedRoute,
    private router: Router,
    private payRecurrenceService: PayRecurrenceService
	) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
		  	if ( this.paramValidator.paramsAreValid(params) ) {
          let payday = new Payday();
          payday.nextPayday = new Date(params.date);
          payday.paycheckAmount = +params.pay;
          payday.frequency = params.frequency;
          this.payday = this.payRecurrenceService.buildResults(payday);
		  	} else {
          this.router.navigateByUrl('/');
		  	}
      });
  }

}
