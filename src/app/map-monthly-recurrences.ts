import * as moment from 'moment/moment';
import { Moment }  from 'moment/moment';

import { Month } from './month';


export const mapMonthlyRecurrences = (start: Moment,
                            end: Moment,
                            period: number,
                            includeCurrentMonth: boolean=true) => {

  // `backwards` indicates `end` is a time before `start`
  // and therefore we're looking for past reccurrences
  let backwards = start.diff(end) > 0;
  let current = start.clone();
  let recurrences: Month[] = [];
  let currentMonth = start.clone().subtract(start.date()-1, 'days');


  /***************** DATA ADJUSTMENTS *****************/

  // Offset by one month to ensure the first month gets added correctly
  backwards ? currentMonth.add(1, 'month') : currentMonth.subtract(1, 'month');

  // If we're looking for future recurrences
  // and want to include the current month.
  if (includeCurrentMonth && !backwards) {

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
      }
  }

  // If we're looking for past recurrences
  // and want to include the current month.
  else if (includeCurrentMonth && backwards) {

    // Check the remaining days in the month to see if
    // there are additional recurrence this month
    const remainingDays = current.clone().endOf('months').date() - current.date()
    if (remainingDays > period) {

      // Find the number of remaining periods
      let recurrenceCount = Math.floor((remainingDays)/period);

      // Adjust the date accordingly
      current.add(period*recurrenceCount, 'days');
    }
  }


  /***************** HELPER FUNCTIONS *****************/

  const createNextMonth = ():Month => {
    currentMonth[backwards ? 'subtract' : 'add'](1, 'month');
    let m = currentMonth.clone();
    let month   = new Month();
    month.name  = m.format('MMMM');
    month.year  = m.format('YYYY');
    month.index = m.month();
    return month;
  }

  const monthsAreEqual = ():boolean => {
    return (currentMonth.year()  === current.year() &&
            currentMonth.month() === current.month());
  }

  const exitCondition = ():boolean => {
    if (backwards) return current.diff(end) > 0;
    return end.diff(current) > 0;
  }

  /***************** MAIN MAPPER LOOP *****************/

  // Generate an array containing data for each month
  // and include recurrence data in months in which recurrences occurs.
  while (exitCondition()) {
      if (!monthsAreEqual()) {

        // Create months with 0 recurrences for
        // months that do not have a reccurrence
        while (!monthsAreEqual()) {
          recurrences.push(createNextMonth());
        }
      }

      let month = recurrences[recurrences.length-1];
      month.recurrenceCount++;
      month.recurrenceDates.push( current.clone() );

      // Increment/decrement current date 
      // in order to prepare to get the next reccurence
      current[backwards ? 'subtract' : 'add'](period, 'days');
  }
  return recurrences;
};
