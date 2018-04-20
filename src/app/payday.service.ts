import { Injectable } from '@angular/core';
import * as moment    from 'moment/moment';
import { Moment }     from 'moment/moment';

import { Month } from './month';

@Injectable()
export class PaydayService {
  
  constructor() { }

  nextPayday: Date;
  paycheckAmount: number;
  lowMonthPayAmount: number;
  highMonthPayAmount: number;
  lowNumberOfPeriods: number;
  outlierMonthsAreHigh: boolean;
  outliersExist: boolean;
  frequency: string;
  frequencyInDays: number;
  endMoment: Moment;
  lowMonths: Month[] = [];
  highMonths: Month[] = [];
  totalHighPay: number;
  totalLowPay: number;
  highMonthsPhrase: string;
  lowMonthsPhrase: string;
  mappedMonths: Month[] = [];


  nextPaydayMoment(): Moment {
    return moment(this.nextPayday);
  }

  frequencyOptions: string[] = ['',
                                'Every 2 weeks',
                                'Every week',
                                'Every month',
                                'Other'];

  optionAsURL(str): string {
      return str ?
             str.split(' ').join('-').toLowerCase() :
             '';
  }

  isOption(frequency: string): boolean {
      for (let option of this.frequencyOptions) {
          if (frequency === this.optionAsURL(option) &&
              frequency !== '') return true;
      }
      return false;
  }

  getFrequencyInDays() {

    switch (this.frequency) {

      case "Every 2 weeks":
        return 14;

      case "Every week":
        return 7;

      case "Other":
        return this.frequencyInDays;

      case "Every month":
        return -1;

      default:
        return -2;
    }
  }

}
