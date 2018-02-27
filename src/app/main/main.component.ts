import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { ParamValidatorService }    from '../param-validator.service';
import { PaydayService }            from '../payday.service';

import * as moment from 'moment/moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  errors : string[] = [];

  constructor(
    private paramValidator:   ParamValidatorService,
    private router:           Router,
    public  pd:               PaydayService
    ) { }

  selectAllContent($event) {
    $event.target.select();
  }

  showResults() {
    let frequency = this.pd.getFrequencyInDays();
    this.pd.nextPayday = this.strToDate(this.pd.nextPayday);
    const params = {
      pay:       this.pd.paycheckAmount || 0,
      date:      this.pd.nextPaydayMoment().format('YYYY-MM-DD'),
      frequency: frequency
    }

    if (this.paramValidator.paramsAreValid(params)) {
      const url = "/results?pay="+params.pay+
                         "&date="+params.date+
                    "&frequency="+params.frequency;
      this.router.navigateByUrl(url);
    } else {
      console.log('params invalid');
      this.errors = this.paramValidator.getErrors();
    }
  }

  private strToDate(date): Date {
    return String(typeof(date) === 'string') ?
           moment(date, 'YYYY-MM-DD').toDate() :
           date;
  }

  ngOnInit() {
    if (this.paramValidator.isError()) {
      this.errors = this.paramValidator.getErrors();
    }
      this.pd.nextPayday = this.pd.nextPayday || new Date();
      this.pd.paycheckAmount = this.pd.paycheckAmount || 0;
      this.pd.frequency = undefined;
  }
}
