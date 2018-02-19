
import { Month } from './month';


export const mapToMonths = (startDate: Date, 
                            endDate: Date, 
                            period: number, 
                            beginningOfMonth: boolean=true): Month[] => {

  const monthsOfTheYear : string[] = ['January',
                                      'February',
                                      'March',
                                      'April',
                                      'May',
                                      'June',
                                      'July',
                                      'August',
                                      'September',
                                      'October',
                                      'November',
                                      'December' ];

  let currentDate = new Date(startDate.getTime());
  let recurrences: Month[] = [];
  let currentMonth = -1;

  if (beginningOfMonth) {

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
          var length = recurrences.push(new Month());
          recurrences[length-1].name = monthsOfTheYear[currentDate.getUTCMonth()];
      }

      var month = recurrences[recurrences.length-1];
      month.recurrenceCount++;
      month.recurrenceDates.push( new Date(currentDate.getTime() ) );

      currentDate.setTime( currentDate.getTime() + period * 86400000 );
  }
  return recurrences;
};
