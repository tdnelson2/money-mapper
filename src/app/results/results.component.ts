import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';

import { ParamValidatorService } from '../param-validator.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(
  	private paramValidator: ParamValidatorService,
    private route: ActivatedRoute,
    private router: Router
	) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
		  	if ( !this.paramsAreValid(params) ) {
		  		this.router.navigateByUrl('/');
		  	}
      });
  }

  private paramsAreValid(params): boolean {
  	return this.paramValidator.validateParams(params.pay, params.date, params.frequency);
  }

}
