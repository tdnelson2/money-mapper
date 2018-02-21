import * as moment from 'moment/moment';
import { Moment }  from 'moment/moment';

import { Month } from './month';


export const mapToMonths = (start: Moment,
                            end: Moment,
                            period: number,
                            beginningOfMonth: boolean=true): Month[] => {

  let current = start.clone();
  let recurrences: Month[] = [];
  let currentMonth = -1;

  if (beginningOfMonth) {

      // Represent all the periods from the beginning of the month.
      // To do so, we need to establish the earliest point in which
      // the period first occurred in `start`'s initial month.
      if (current.date() > period) {

          // Find the number of prior periods in the month.
          let recurrenceCount = Math.floor(start.date()/period);

          // Subtract those periods to get the earliest
          // occurence in `start`'s initial month.
          current.subtract(period*recurrenceCount, 'days');

          // Subtract the same number of days from end date
          end.subtract(period*recurrenceCount, 'days');
      }
  }

  console.log('end moment: ', end.format('YYYY-MM-DD'));


  // Generate an array containing recurrence data for each month
  // in which a recurrence occurs.
  while (end.diff(current) > 0) {

      if (currentMonth !== current.month()) {
          currentMonth = current.month();
          let i = recurrences.push(new Month())-1;
          recurrences[i].name = current.format('MMMM');
          recurrences[i].year = current.format('YYYY');
      }

      let month = recurrences[recurrences.length-1];
      month.recurrenceCount++;
      month.recurrenceDates.push( current.clone() );

      current.add(period, 'days');
      console.log(current.format('YYYY-MM-DD'));
  }
  return recurrences;
};
