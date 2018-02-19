import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { YyyymmddService } from '../yyyymmdd.service';
import { FrequencyOptionsService } from '../frequency-options.service';
import { Payday } from '../payday';
import { ParamValidatorService } from '../param-validator.service';
import { PaydaySessionDataService } from '../payday-session-data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  payday: Payday;
  payFrequencyOptions: string[] = this.frequencyOptions.frequencyOptions;
  errors : string[] = [];

  constructor(
    private yyyymmddService: YyyymmddService,
    private frequencyOptions: FrequencyOptionsService,
    private paramValidator: ParamValidatorService,
    private router: Router
    ) { }

  selectAllContent($event) {
    $event.target.select();
  }

  showResults() {
    this.payday.nextPayday =    this.yyyymmddService
                                    .strToDate(this.payday.nextPayday);
    const url = "/results?pay="+this.payday
                                    .paycheckAmount+
                       "&date="+this.yyyymmddService
                                    .makeyyymmmddd(this.payday.nextPayday)+
                  "&frequency="+this.frequencyOptions
                                    .optionAsURL(this.payday.frequency);
    this.router.navigateByUrl(url);
  }

  ngOnInit() {
    if (this.paramValidator.isError()) {
      this.errors = this.paramValidator.getErrors();
    }
    this.payday.nextPayday = new Date();
    this.payday.paycheckAmount = 0;
  }

}
