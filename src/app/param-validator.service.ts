import { Injectable } from '@angular/core';

import { isNumber, isNaN, has } from 'lodash';

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


  constructor( ) { }

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
      } else if (!this.isValidDate(p.date)) {
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

  // Adapted from https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
  private isValidDate(dateString): boolean {
    let regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    let d = new Date(dateString);
    if(!d.getTime() && d.getTime() !== 0) return false; // Invalid date
    return d.toISOString().slice(0,10) === dateString;
  }

}
