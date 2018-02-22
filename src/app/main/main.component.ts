import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { DateTools }                from '../date-tools';
import { FrequencyOptionsService }  from '../frequency-options.service';
import { Payday }                   from '../payday';
import { ParamValidatorService }    from '../param-validator.service';
import { PaydaySessionDataService } from '../payday-session-data.service';

import * as moment from 'moment/moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  payFrequencyOptions: string[] = this.frequencyOptions.frequencyOptions;
  errors : string[] = [];

  constructor(
    private frequencyOptions: FrequencyOptionsService,
    private paramValidator:   ParamValidatorService,
    private router:           Router,
    private pd:               PaydaySessionDataService
    ) { }

  selectAllContent($event) {
    $event.target.select();
  }
  // public frequencyOptions: string[] = ['', 
  //                                      'Every 2 weeks', 
  //                                      'Every week', 
  //                                      'Every month', 
  //                                      'Other'];
  // nextView() {
  //   if (this.pd.data.frequency === "Every 2 weeks" ||
  //       this.pd.data.frequency === "Every week") {
  //     this.showResults(this.pd.data.frequency)
  //   } else {

  //     switch (this.pd.data.frequency) {
        
  //       case "Every month":
  //         //
  //         break;
        
  //       case "Other":
  //         this.showResults(this.pd.data.frequency)
  //         break;
        
        
  //       default:
  //         // code...
  //         break;
  //     }

  //   }
  // }

  showResults(frequency: string) {
    console.log('nextPayday: ', this.pd.data.nextPayday)
    this.pd.data.nextPayday = DateTools.strToDate(this.pd.data.nextPayday);
    console.log('nextPayday: ',this.pd.data.nextPayday);
    const params = {
      pay:       this.pd.data.paycheckAmount || 0,
      date:      this.pd.data.nextPaydayMoment().format('YYYY-MM-DD'),
      frequency: this.frequencyOptions.optionAsURL(frequency)
    }

    if (this.paramValidator.paramsAreValid(params)) {
      this.pd.data.nextPayday =   DateTools
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
      this.pd.data.frequency = undefined;
  }
}
