import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { YyyymmddService } from './yyyymmdd.service';
import { FrequencyOptionsService } from './frequency-options.service';

@Injectable()
export class ParamValidatorService {

  paramKeys = ['pay', 'date', 'frequency'];
  private errors : string[] = [];

  isError():boolean {
    return this.errors.length > 0;
  }

  clearErrors():void {
    this.errors = [];
  }

  getErrors(): string[] {
    const errors = this.errors.slice(0);
    this.clearErrors();
    return errors;
  }


  constructor(
  	private yyyymmdd: YyyymmddService,
  	private frequencyOptions: FrequencyOptionsService
  	) { }

  paramsAreValid(p):boolean {
    let missing = this.checkForMissingParams(p);
    let errors: string[] = [];
    if (missing.length > 0) {
      errors.push(`Value(s) missing for '${missing.join(', ')}'`);
      this.errors = errors;
      return true;
    } else {
      if (p.pay == 'NaN' || !p.pay) {
          errors.push(`Error parsing pay: no value found.`);
      } else if (!_.isNumber(+p.pay) || _.isNaN(+p.pay)) {
        errors.push(`Error parsing pay: '${p.pay}' is not valid number.`);
      }

      if (p.date == 'NaN' || !p.date) {
        errors.push(`Error parsing date: no value found.`);
      } else if (!this.yyyymmdd.isValidDate(p.date)) {
        errors.push(`Error parsing date: '${p.date}' is invalid.`);
      }


      if (p.frequency == 'NaN' || !p.frequency) {
        errors.push(`Error parsing frequency: no value found.`);
      } else if (!this.frequencyOptions.isOption(p.frequency)) {
        errors.push(`Error parsing pay frequency: '${p.frequency}' is not an option.`);
      }
    }
    this.errors = errors;
    return !this.isError();
  }

  private checkForMissingParams(p): string[] {
    let missing : string[] = [];
    for (const key of this.paramKeys) {
      if (!_.has(p, key)) {
        missing.push(key);
      }
    }
    return missing;
  }

}
