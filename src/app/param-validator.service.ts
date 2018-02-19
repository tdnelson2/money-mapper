import { Injectable } from '@angular/core';

// import * as _ from 'lodash';
import { isNumber, isNaN, has } from 'lodash';

import { YyyymmddService } from './yyyymmdd.service';
import { FrequencyOptionsService } from './frequency-options.service';
import { arrayToSentence } from './array-to-sentence';

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
      const missingInQuotes = missing.map( m => `'${m}'`);
      errors.push(`Value${missing.length > 1 ? 's' : ''} \
                   missing for ${arrayToSentence(missingInQuotes)}`);
      this.errors = errors;
      return false;
    } else {
      if (String(p.pay) == 'NaN' || !p.pay) {
          errors.push(`Error parsing pay: no value found.`);
      } else if (!isNumber(+p.pay) || isNaN(+p.pay)) {
        errors.push(`Error parsing pay: '${p.pay}' is not valid number.`);
      }

      if (String(p.date) == 'NaN' || !p.date) {
        errors.push(`Error parsing date: no value found.`);
      } else if (!this.yyyymmdd.isValidDate(p.date)) {
        errors.push(`Error parsing date: '${p.date}' is invalid.`);
      }


      if (String(p.frequency) == 'NaN' || !p.frequency) {
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
      if (!has(p, key)) {
        missing.push(key);
      }
    }
    return missing;
  }

}
