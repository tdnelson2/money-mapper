import { Injectable } from '@angular/core';

import { Month } from './month';

@Injectable()
export class MonthlyRecurrenceMapperService {

  constructor() { }

  public mapToMonths(startDate: Date,
  									 endDate: Date,
  									 period: number,
  									 shouldBeginAtStartofMonth: boolean = true) {

      let currentDate = new Date(startDate.getTime());
      let recurrences = [];
      let currentMonth = -1;

      if (shouldBeginAtStartofMonth) {

          // Represent all the periods from the beginning of the month.
          // To do so, we need to establish the earliest point in which
          // the period first occurred in `startDate`'s initial month.
          if (currentDate.getUTCDate() > period) {

              // Find the number of prior periods in the month.
              let recurrenceCount = Math.floor(startDate.getUTCDate()/period);

              // Subtract those periods to get the earliest
              // occurence in `startDate`'s initial month.
              let timeToSubtract = (period * 86400000) * recurrenceCount;
              currentDate.setTime( currentDate.getTime() - timeToSubtract );
          }
      }


      // Generate an array containing recurrence data for each month
      // in which a recurrence occurs.
      while (currentDate <= endDate) {

          if (currentMonth !== currentDate.getUTCMonth()) {
              currentMonth = currentDate.getUTCMonth();
              let length = recurrences.push(new Month());
              recurrences[length-1].set
          }

          let month = recurrences[recurrences.length-1];
          month.recurrenceCount++;
          month.recurrenceDates.push( new Date(currentDate.getTime() ) );

          currentDate.setTime( currentDate.getTime() + period * 86400000 );
      }
      return recurrences;
  };
}
