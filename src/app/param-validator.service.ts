import { Injectable } from '@angular/core';

import { isNumber, isNaN, has } from 'lodash';

import { DateTools }               from './date-tools';
import { FrequencyOptionsService } from './frequency-options.service';
import { arrayToSentence }         from './array-to-sentence';

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
  	private frequencyOptions: FrequencyOptionsService
  	) { }

  paramsAreValid(p):boolean {
    let missing = this.checkForMissingParams(p);
    let errors: string[] = [];

    if (missing.length > 0) {
      const missingInQuotes = missing.map( m => `'${m}'`);
      errors.push(`Value${missing.length > 1 ? 's' : ''} missing for \
                  ${arrayToSentence(missingInQuotes)}`);
      this.errors = errors;
      return false;
    } else {
      if (String(p.pay) == 'NaN' || !p.pay) {
          errors.push(`Did you forget to add your paycheck amount?`);
      } else if (!isNumber(+p.pay) || isNaN(+p.pay)) {
        errors.push(`'${p.pay}' is not valid paycheck amount.`);
      }

      if (String(p.date) == 'NaN' || !p.date) {
        errors.push(`Error parsing date: no value found.`);
      } else if (!DateTools.isValidDate(p.date)) {
        errors.push(`'${p.date}' is not a valid date.`);
      }


      if (String(p.frequency) == 'NaN' || !p.frequency) {
        errors.push(`Error parsing frequency: no value found.`);
      } else if (!isNumber(+p.frequency) || isNaN(+p.frequency)) {
        errors.push(`'${p.frequency}' is not a number. \
                     Number of days between paydays is expected.`);
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
