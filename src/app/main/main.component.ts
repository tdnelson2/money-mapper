import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { YyyymmddService }          from '../yyyymmdd.service';
import { FrequencyOptionsService }  from '../frequency-options.service';
import { Payday }                   from '../payday';
import { ParamValidatorService }    from '../param-validator.service';
import { PaydaySessionDataService } from '../payday-session-data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  payFrequencyOptions: string[] = this.frequencyOptions.frequencyOptions;
  errors : string[] = [];

  constructor(
    private yyyymmddService:  YyyymmddService,
    private frequencyOptions: FrequencyOptionsService,
    private paramValidator:   ParamValidatorService,
    private router:           Router,
    private pd:               PaydaySessionDataService
    ) { }

  selectAllContent($event) {
    $event.target.select();
  }

  showResults() {
    this.pd.data.nextPayday = this.yyyymmddService
                                  .strToDate(this.pd.data.nextPayday);
    const params = {
      pay:       this.pd.data.paycheckAmount || 0,
      date:      this.yyyymmddService.makeyyymmmddd(this.pd.data.nextPayday),
      frequency: this.frequencyOptions.optionAsURL(this.pd.data.frequency)
    }

    if (this.paramValidator.paramsAreValid(params)) {
      this.pd.data.nextPayday =   this.yyyymmddService
                                      .strToDate(this.pd.data.nextPayday);
      const url = "/results?pay="+params.pay+
                         "&date="+params.date+
                    "&frequency="+params.frequency;
      this.router.navigateByUrl(url);
    } else {
      console.log('params invalid');
      this.errors = this.paramValidator.getErrors();
    }
  }

  ngOnInit() {
    if (this.paramValidator.isError()) {
      this.errors = this.paramValidator.getErrors();
    }
      this.pd.data.nextPayday = this.pd.data.nextPayday || new Date();
      this.pd.data.paycheckAmount = this.pd.data.paycheckAmount || 0;
  }
}
