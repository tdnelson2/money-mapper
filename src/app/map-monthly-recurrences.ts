import * as moment from 'moment/moment';
import { Moment }  from 'moment/moment';

import { Month } from './month';


export const mapMonthlyRecurrences = (start: Moment,
                            end: Moment,
                            period: number,
                            beginningOfMonth: boolean=true): Month[] => {

  let current = start.clone();
  let recurrences: Month[] = [];
  let currentMonth = start.clone();
  currentMonth.subtract(currentMonth.date()-1, 'days').subtract(1, 'month');

  if (beginningOfMonth) {

      // Represent all the periods from the beginning of the month.
      // To do so, we need to establish the earliest point in which
      // the period first occurred in `start`'s initial month.
      if (current.date() > period) {

          // Find the number of prior periods in the month.
          // Since months are not 0 based (no such thing as the
          // 0th day of the month), we need to subtract one day.
          let recurrenceCount = Math.floor((start.date()-1)/period);

          // Subtract those periods to get the earliest
          // occurence in `start`'s initial month.
          current.subtract(period*recurrenceCount, 'days');

          // Subtract the same number of days from end date
          end.subtract(period*recurrenceCount, 'days');
      }
  }

  const createNextMonth = ():Month => {
    currentMonth.add(1, 'month');
    let m = currentMonth.clone();
    let month   = new Month();
    month.name  = m.format('MMMM');
    month.year  = m.format('YYYY');
    month.index = m.month();
    return month;
  }

  const monthsAreEqual = ():boolean => {
    let r = (currentMonth.year()  === current.year()) &&
           (currentMonth.month() === current.month());
    return r;
  }


  // Generate an array containing recurrence data for each month
  // in which a recurrence occurs..
  let loops = 0;
  while (end.diff(current) > 0) {
    loops++
    console.log(`\nthis loop is ${loops}\n`);

      if (!monthsAreEqual()) {

        // Create months with 0 recurrences for
        // months that do not have a reccurrence
        while (!monthsAreEqual()) {
          recurrences.push(createNextMonth());
        }
        let i = recurrences.length -1;
        recurrences[i].name = current.format('MMMM');
        recurrences[i].year = current.format('YYYY');
      }

      let month = recurrences[recurrences.length-1];
      month.recurrenceCount++;
      month.recurrenceDates.push( current.clone() );

      current.add(period, 'days');
  }
  return recurrences;
};
