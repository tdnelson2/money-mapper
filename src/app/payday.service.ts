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
  lowNumberOfPeriods: number;
  frequency: string;
  frequencyInDays: number;
  endMoment: Moment;
  mappedMonths: Month[] = [];


  nextPaydayMoment(): Moment {
    return moment(this.nextPayday);
  }

  frequencyOptions: string[] = ['',
                                'Every 2 weeks',
                                'Every week',
                                'Every month',
                                'Other'];

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
